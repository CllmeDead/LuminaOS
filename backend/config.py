from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "sqlite:///./lumina.db"
    app_env: str = "development"
    secret_key: str = "dev-secret"
    groq_api_key: str = ""

    class Config:
        env_file = ".env"

settings = Settings()