from pydantic import BaseModel


class ResponseData(BaseModel):
    id:str
    document_type: str
    document_name: str
    raw_content: list
    uploaded_on:str
    content: list | None = None

