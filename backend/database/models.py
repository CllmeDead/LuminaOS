from database.connection import Base
from sqlalchemy import (
    Column, Integer, String, Text, Boolean,
    DateTime, ForeignKey, Table, Float, Enum
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum


class TaskPriority(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class TaskStatus(enum.Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"
    ARCHIVED = "archived"

class MOODLEVEL(enum.Enum):
    GREAT = "great"
    GOOD = "good"
    NEUTRAL = "neutral"
    LOW = "low"
    ROUGH = "rough"

class HabitFrequency(enum.Enum):
    DAILY = "daily"
    WEEKLY = "weekly"


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(225), nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(Enum(TaskPriority), default=TaskPriority.MEDIUM, nullable=False)
    status = Column(Enum(TaskStatus), default=TaskStatus.TODO, nullable=False)
    due_date= Column(DateTime, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    is_deleted = Column(Boolean, default=False)

    category_id = Column(
        Integer,
        ForeignKey("categories.id", ondelete="SET NULL"),
        nullable=True
    )

    category = relationship("Category", back_populates="tasks")
                        

class PomodoroSession(Base):
    __tablename__ = "pomodoro_sessions"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    duration_minutes = Column(Integer, default=25, nullable=False)
    break_duration_minutes = Column(Integer, default=5, nullable=False)
    completed = Column(Boolean, default=False)
    started_at = Column(DateTime(timezone=True), nullable=False)
    ended_at = Column(DateTime(timezone=True), nullable=True)

    notes = Column(Text, nullable=True)


class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    mood = Column(Enum(MOODLEVEL), nullable=True)

    tags = Column(String(500), nullable=True)

    ai_summary = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_deleted = Column(Boolean, default=False)


class Habit(Base):
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    frequency = Column(Enum(HabitFrequency), default=HabitFrequency.DAILY)
    color = Column(String(7), default="#F59E0B")
    icon = Column(String(50), nullable=True)
    target_streak = Column(Integer, default=30)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)

    completions = relationship("HabitCompletion", back_populates="habit")


class HabitCompletion(Base):
    __tablename__ = "habit_completions"

    id = Column(Integer, primary_key=True, index=True)
    habit_id = Column(Integer, ForeignKey("habits.id"), nullable=False)
    completed_at = Column(DateTime(timezone=True), server_default=func.now())
    notes = Column(Text, nullable=True)

    habit = relationship("Habit", back_populates="completions")


class  AIInsight(Base):
    __tablename__ = "ai_insights"

    id = Column(Integer, primary_key=True, index=True)
    insight_type = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    data_snapshot = Column(Text, nullable=True)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    is_read = Column(Boolean, default=False)


class MoodCheckin(Base):
    __tablename__ = "mood_checkins"

    id = Column(Integer, primary_key=True, index=True)
    mood = Column(Enum(MOODLEVEL), nullable=False)
    energy_level = Column(Integer, nullable=True)
    notes = Column(String(500), nullable=True)
    checked_in_at = Column(DateTime(timezone=True), server_default=func.now())

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    color = Column(String(7), default="#F59E0B")
    icon = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    tasks = relationship("Task", back_populates="category")

def seed_default_categories(db):
    existing = db.query(Category).first()
    if existing:
        return
    
    defaults = [
        Category(name="Work", color="#6366F1", icon="💼"),
        Category(name="Personal", color="#F59E0B", icon="🏠"),
        Category(name="Health", color="#10B981", icon="🏃"),
        Category(name="Learning", color="#8B5CF6", icon="📚"),
        Category(name="Finance", color="#EF4444", icon="💰")
    ]

    db.add_all(defaults)
    db.commit()
