# Lumina — Personal AI Productivity OS

A beautiful, full-stack productivity app with AI features built with FastAPI, React, and Groq.

## Features
- Task management with priorities and categories
- Daily journal with mood tracking
- Habit tracker with streak visualization
- Pomodoro focus timer with soundscapes
- Mood check-in with history charts
- AI morning briefing, pattern detection, and insights
- Desktop app via Electron

## Tech Stack
- **Backend:** Python + FastAPI + SQLite
- **Frontend:** React + Tailwind CSS + Framer Motion
- **Desktop:** Electron
- **AI:** Groq (Llama 3.3 70B)

## Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create a `.env` file in the `backend/` folder:
```
DATABASE_URL=sqlite:///./lumina.db
GROQ_API_KEY=your-key-here
```