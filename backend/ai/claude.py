from groq import Groq
from config import settings

client = None
if settings.groq_api_key:
    client = Groq(api_key=settings.groq_api_key)

def ask_claude(
        prompt: str,
        system: str = "You are Lumina, a warm and insightful personal productivity AI.",
        max_tokens: int = 500
) -> str:
    if not client:
        raise RuntimeError(
            "GROQ_API_KEY is not configured. "
            "Set GROQ_API_KEY in your Render environment variables."
        )

    message = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=max_tokens,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt}
        ])
    return message.choices[0].message.content # type: ignore

def get_mood_system_prompt(mood: str) -> str:
    mood_prompts = {
        "great":   "You are Lumina, an enthusiastic and energetic productivity AI. "
                   "The user is feeling great — match their energy, be upbeat "
                   "and ambitious. Push them toward big goals.",

        "good":    "You are Lumina, a warm and encouraging productivity AI. "
                   "The user is in a good mood — be positive and supportive. "
                   "Celebrate their progress and keep momentum going.",

        "neutral": "You are Lumina, a calm and focused productivity AI. "
                   "The user is feeling neutral — be steady, practical, and clear. "
                   "Help them find direction without overwhelming them.",

        "low":     "You are Lumina, a gentle and understanding productivity AI. "
                   "The user is feeling low — be soft, encouraging, and kind. "
                   "Suggest smaller, achievable tasks. Don't overwhelm them.",

        "rough":   "You are Lumina, a compassionate and patient productivity AI. "
                   "The user is having a rough day — prioritize their wellbeing. "
                   "Be warm, gentle, suggest self-care alongside only essential tasks.",
    }
    return mood_prompts.get(mood, mood_prompts["neutral"])