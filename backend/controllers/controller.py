import os

from fastapi import UploadFile

from base_models import ResponseData
from settings import init_db
from utils import HANDLERS


async def ingest(db, files: [UploadFile]):
    data_to_insert = []
    return_data = []
    file_raw_content = []
    for file in files:
        filename, file_extension = os.path.splitext(file.filename)
        file_extension = file_extension.replace(".", "")
        if file_extension in HANDLERS:
            content = await file.read()
            for args in HANDLERS[file_extension](content=content, filename=filename):
                data_to_insert.append(args.to_list())
                file_raw_content.append(args.raw_content)
            return_data.append(ResponseData(
                id=args.id,
                document_type=file_extension,
                document_name=filename,
                raw_content=file_raw_content,
                uploaded_on=args.uploaded_on,
            ))
            file_raw_content = []
    await db.insert_documents(data_to_insert)
    return return_data


async def search(db, query):
    return await db.search_documents(query=query)


async def restart():
    try:
        os.remove("documents.db")
        await init_db()
        return True
    except FileNotFoundError:
        return False


async def get_all_files(db):
    return await db.get_all_files()

# asyncio.run(ingest(DatabaseEngine()))
