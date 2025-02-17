import aiosqlite

import settings  # noqa
from settings import DB_NAME, TABLE_NAME

# schema

'''
id
document_type,
document_name,
page_no,
raw_content,
content,
line_no,
'''


class DatabaseEngine():
    def __init__(self):
        self.db_name = DB_NAME
        self.table_name = TABLE_NAME

    # Insert a document into the 'documents' table and sync the FTS5 table
    async def insert_documents(self, documents: list[list]):
        async with aiosqlite.connect(self.db_name) as db:
            # Insert multiple rows using executemany
            await db.executemany(f"""
                INSERT INTO {self.table_name} (id,document_type,document_name,raw_content,line_no,uploaded_on,content,page_no)
                VALUES (?,?,?,?,?,?,?,?)
            """, documents)
            await db.commit()

    # Perform a full-text search on the 'documents_fts' virtual table
    async def search_documents(self, query: str):
        async with aiosqlite.connect(self.db_name) as db:
            # Perform a full-text search query
            async with db.execute(f"""
                SELECT * 
    FROM  {self.table_name}
    WHERE raw_content LIKE ?;
            """, (f"%{query}%",)) as cursor:
                rows = await cursor.fetchall()
                return rows

    async def get_all_files(self):
        async with aiosqlite.connect(self.db_name) as db:
            async with db.execute(f"""
            SELECT 
    id, 
    document_type, 
    document_name, 
    uploaded_on, 
    GROUP_CONCAT(raw_content, '\n') AS combined_content
FROM {self.table_name}
GROUP BY id, document_type, document_name, uploaded_on;
            """) as cursor:
                rows = await cursor.fetchall()
                return rows

# Main function to demonstrate usage
# async def main():
#     db = DatabaseEngine('documents.db', "documents")
#     # Initialize the database
#     await db.init_db()
#
#     # Insert some documents
#     await db.insert_documents([("Hello World", "This is the first document"),
#                                ("Python SQLite", "Using SQLite with async operations and full-text search")])
#
#     # Search for documents containing the word 'Python'
#     results = await db.search_documents('Python')
#     print("Search Results:")
#     for result in results:
#         print(f"Document ID: {result[0]}, Title: {result[1]}")


# Run the main function
# asyncio.run(main())
