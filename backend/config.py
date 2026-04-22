import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
MAX_QUESTIONS: int = int(os.getenv("MAX_QUESTIONS", "20"))
REQUEST_TIMEOUT: int = int(os.getenv("REQUEST_TIMEOUT", "90"))

# Temp directory for file exports
TEMP_DIR: str = os.getenv("TEMP_DIR", "/tmp")
