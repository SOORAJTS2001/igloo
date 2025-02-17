import asyncio
import os
from pathlib import Path
import aiosqlite
from dotenv import load_dotenv

load_dotenv("../local.env")

PROJECT_ROOT  = Path(__file__).resolve().parent.parent

STATIC_DIRECTORY = os.path.join(PROJECT_ROOT, os.getenv("STATIC_DIRECTORY", "data"))
DB_NAME = os.path.join(PROJECT_ROOT, os.getenv("DB_NAME", "documents.db"))
MAX_COLUMN = int(os.getenv("MAX_COLUMN", 1))
MAX_ROW = int(os.getenv("MAX_ROW", 6000))
TABLE_NAME = os.getenv("TABLE_NAME", "documents")



async def init_db():
    async with aiosqlite.connect(database=DB_NAME) as db:
        await db.execute(f"""
            CREATE VIRTUAL TABLE IF NOT EXISTS {TABLE_NAME}
USING FTS5(
id,
document_type,
document_name,
page_no,
raw_content,
content,
line_no,
uploaded_on,
tokenize='porter'
)
        """)
        await db.commit()


