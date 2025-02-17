from typing import List,Optional

from fastapi import FastAPI, UploadFile,Query
from fastapi.middleware.cors import CORSMiddleware

from controllers.controller import search, get_all_files, ingest, restart
from settings import init_db
from utils import DatabaseEngine

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, etc.
    allow_headers=["*"],  # Allows all headers
)

databases = {}


@app.on_event("startup")
async def startup_event():
    databases["sqlite3"] = DatabaseEngine()
    await init_db()


@app.get("/search")
async def handle_search(query:Optional[str] = Query(default=None)):
    print(type(query),query)
    db = databases['sqlite3']
    # if query:
    result= await get_all_files(db=databases["sqlite3"]) 
    # else:
    #     result = await search(db=db, query=query)
    return {"result": result}


@app.post("/upload_files")
async def handle_upload(files: List[UploadFile]):
    db = databases['sqlite3']
    # for file in files:
    #     await file.read()

    return await ingest(db=db, files=files)



@app.get("/get_all_files")
async def handle_get_all_files():
    return await get_all_files(db=databases["sqlite3"])

@app.get("/restart")
async def handle_restart():
    if await restart():
        return {"status": "ok"}
    return {"status": "fail"}
