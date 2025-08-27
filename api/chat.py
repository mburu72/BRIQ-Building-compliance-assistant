from typing import Dict, List

from fastapi import Header, APIRouter, HTTPException

from agent_service.agent import MemoryAgent
from crud.chats import load_messages
from models.models import Query, AnswerResponse

router = APIRouter()

agents: Dict[str, MemoryAgent] = {}

@router.post("/ask")
async def ask_question(query: Query, session_id: str = Header(None, alias="X-Session-Id")):
    if not session_id:
        raise HTTPException(status_code=400, detail="X-Session-Id header missing")

    if session_id not in agents:
        agents[session_id] = MemoryAgent(session_id)

    chat_manager = agents[session_id]
    answer = await chat_manager.chat(query.question)  # returns dict (AgentAnswer.model_dump())

    return answer

@router.get("/history", response_model=List[AnswerResponse])
def get_chat_history(session_id: str = Header(None, alias="X-Session-Id")):
    if not session_id:
        raise HTTPException(status_code=400, detail="Missing session Id")

    rows = load_messages(session_id)


    history = []
    i = 0
    while i < len(rows):
        role, content = rows[i]
        if role != "user":
            i += 1
            continue
        question = content
        answer = ""
        if i + 1 < len(rows) and rows[i + 1][0] == "assistant":
            answer = rows[i + 1][1]
            i += 1
        history.append(AnswerResponse(question=question, answer=answer))
        i += 1

    return history