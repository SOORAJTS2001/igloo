import datetime

from pydantic import BaseModel


class DocumentData(BaseModel):
    id: str
    document_type: str
    document_name: str
    raw_content: str
    line_no: int
    uploaded_on: datetime
    content: str | None = None
    page_no: int | None = None

    class Config:
        arbitrary_types_allowed = True

    def to_dict(self):
        return self.__dict__.copy()

    def to_list(self):
        return list(self.dict().values())
