import os
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from api import chat
from core.database import init_db
from docops.docops import load_and_index

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    load_and_index("docs")

    yield

app = FastAPI(lifespan=lifespan)

app.include_router(chat.router)

@app.get('/health')
def health():
    return "OK", 200

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)

