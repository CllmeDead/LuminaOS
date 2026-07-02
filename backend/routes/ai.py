from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta, timezone
from database.connection import get_db
from database.models import (
    Task, HabitCompletion, JournalEntry,
    MoodCheckin, AIInsight, TaskStatus
)
from ai.claude import ask_claude, get_mood_system_prompt

router = APIRouter(prefix="/ai", tags=["AI"])


class MoodBriefingRequest(BaseModel):
    mood: Optional[str] = "neutral"
    energy_level: Optional[int] = 5

class InsightResponse(BaseModel):
    content: str
    insight_type: str

class MusicRequest(BaseModel):
    task_title: str
    task_category: Optional[str] = None

class WeeklyReportResponse(BaseModel):
    content: str
    generated_at: str


def get_user_context(db: Session) -> dict:

    now = datetime.now(timezone.utc)
    week_ago = now - timedelta(days=7)

    all_tasks = db.query(Task).filter(Task.is_deleted == False).all()
    pending = [t for t in all_tasks if t.status != TaskStatus.DONE] # type: ignore
    completed_week = [
        t for t in all_tasks
        if t.status == TaskStatus.DONE
        and t.updated_at
        and t.updated_at.date() >= (now - timedelta(days=7)).date() # type: ignore
    ]

    habit_completions = db.query(HabitCompletion).filter(
        HabitCompletion.completed_at >= week_ago

    ).count()

    recent_mood = db.query(MoodCheckin).order_by(
        MoodCheckin.checked_in_at.desc()
    ).first()

    recent_entries = db.query(JournalEntry).filter(
        JournalEntry.is_deleted == False,
        JournalEntry.created_at >= week_ago
    ).count()

    return {
        "pending_tasks": len(pending),
        "pending_task_titles": [t.title for t in pending[:5]],
        "completed_this_week": len(completed_week),
        "habit_completions_this_week": habit_completions,
        "recent_mood": recent_mood.mood.value if recent_mood else "unknown",
        "journal_entries_this_week": recent_entries,
    }

@router.post("/morning-briefing", response_model=InsightResponse)
def morning_briefing(
    request: MoodBriefingRequest,
    db: Session = Depends(get_db)
):
    ctx = get_user_context(db)
    mood = request.mood or "neutral"

    prompt = f"""
Generate a warm, personalized morning briefing for a productivity app user.

Their current state:
- Mood: {mood}
- Energy level: {request.energy_level}/10
- Pending_tasks: {ctx['pending_tasks']}
- Top pending tasks: {', '.join(ctx['pending_task_titles']) or 'none'}
- Tasks completed this week: {ctx['completed_this_week']}
- Habit completions this week: {ctx['habit_completions_this_week']}
- Journal entries this week: {ctx['journal_entries_this_week']}

Write a 3-4 sentence morning briefing that:
1. Acknowledges their mood warmly
2. Highlights their most important task for today
3. Mentions their recent progress encouragingly
4. Ends with a brief motivational nudge appropriate for their energy level

Keep it personal, warm, and under 100 words. No bullet points - flowing prose only.
"""
    
    content = ask_claude(prompt, system=get_mood_system_prompt(mood), max_tokens=200)

    db.add(AIInsight(
        insight_type="morning_briefing",
        content=content,
        data_snapshot=str(ctx)
    ))
    db.commit()

    return InsightResponse(content=content, insight_type="morning_briefing")


@router.get("/patterns", response_model=InsightResponse)
def detect_pattern(db: Session = Depends(get_db)):
    ctx = get_user_context(db)

    completions = db.query(Task).filter(
        Task.is_deleted == False,
        Task.status == TaskStatus.DONE,
        Task.updated_at.isnot(None)
    ).all()

    day_counts = {}
    for task in completions:
        if task.updated_at: # type: ignore
            day = task.updated_at.strftime("%A")
            day_counts[day] = day_counts.get(day, 0) + 1

    mood_data = db.query(MoodCheckin).order_by(
        MoodCheckin.checked_in_at.desc()
    ).limit(14).all()

    mood_summary = {}
    for checkin in mood_data:
        mood = checkin.mood.value
        mood_summary[mood] = mood_summary.get(mood, 0) + 1

    prompt = f"""
Analyze this user's productivity data and generate ONE specific, actionable insight.

Task completion by the day of week: {day_counts or 'not enough data yet'}
Mood distribution (last 14 days): {mood_summary or 'not enough data yet'}
Total pending tasks: {ctx['pending_tasks']}
Tasks completed this week: {ctx['completed_this_week']}
Habit completions this week: {ctx['habit_completions_this_week']}

Generate a single insight sentence that:
- is specific and data driven (mention the actual days/numbers if available)
- gives a concrete suggestion based on the pattern
- is encouraging, not critical
- is under 40 words

If there's not enough data yet, give a gentle tip about building consistency.
"""
    
    content = ask_claude(prompt, max_tokens=100)
    return InsightResponse(content=content, insight_type="pattern")


@router.post("/music-suggestion", response_model=InsightResponse)
def music_suggestion(request: MusicRequest):
    prompt = f"""
Suggest the perfect music for this task:
Task: "{request.task_title}"
Category: "{request.task_category or 'general'}"

Give one specific suggestion in this exact format:
"[Genre/type] - [specific reason why it fits this task]"

Under 25 words total. be specific.
"""
    
    content = ask_claude(prompt, max_tokens=60)
    return InsightResponse(content=content, insight_type="music")


@router.get("/weekly-report", response_model=WeeklyReportResponse)
def weekly_report(db: Session = Depends(get_db)):
    ctx = get_user_context(db)
    now = datetime.now(timezone.utc)
    week_ago = now - timedelta(days=7)

    moods = db.query(MoodCheckin).filter(
        MoodCheckin.checked_in_at >= week_ago
    ).all()

    mood_values = {"great": 5, "good": 4, "neutral": 3, "low": 2, "rough": 1}
    avg_mood = (
        sum(mood_values.get(m.mood.value, 3) for m in moods) / len(moods)
        if moods else 3
    )
    mood_label = (
        "great" if avg_mood >= 4.5 else
        "good" if avg_mood >= 3.5 else
        "neutral" if avg_mood >= 2.5 else
        "low"
    )

    prompt = f"""
Generate a warm weekly productivity report for a Lumina user.

This week's data:
- Tasks completed: {ctx['completed_this_week']}
- Tasks still pending: {ctx['pending_tasks']}
- Habit completions: {ctx['habit_completions_this_week']}
- Journal entries written: {ctx['journal_entries_this_week']}
- Average mood this week: {mood_label}
- Number of mood check-ins: {len(moods)}

Write a report with exactly these sections:
1. **This Week** (2 sentences summarizing accomplishments)
2. **Patterns** (1 sentence about something notable in the data)
3. **Next Week** (1-2 sentences suggesting focus areas)
4. **Well done** (1 warm closing sentence)

Use markdown bold for headers. Under 150 words total.
be speciffic with numbers. Be warm and encouraging throughout.
"""
    
    content = ask_claude(prompt, max_tokens=400)

    db.add(AIInsight(
        insight_type="weekly_report",
        content=content, 
        data_snapshot=str(ctx)
    ))
    db.commit()

    return WeeklyReportResponse(
        content=content, 
        generated_at=now.isoformat()
    )


@router.get("/chat", response_model=InsightResponse)
def ai_chat(
    message: str,
    mood: Optional[str] = "neutral",
    db: Session = Depends(get_db)
):
    ctx = get_user_context(db)
    system = get_mood_system_prompt(mood or "neutral")

    prompt = f"""
The user is asking: "{message}"

Their current context:
- Pending tasks: {ctx['pending_tasks']}
- Completed this week: {ctx['completed_this_week']}
- Current mood: {ctx['recent_mood']}

Answer helpfully and concisely as their personal productivity AI.
Keep response under 100 words unless they ask for something bigger.
"""
    
    content = ask_claude(prompt, system=system, max_tokens=300)
    return InsightResponse(content=content, insight_type="chat")
