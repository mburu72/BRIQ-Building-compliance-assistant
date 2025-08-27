from typing import TypedDict, Optional

from pydantic import BaseModel


class Query(BaseModel):
    question: str

class AnswerResponse(BaseModel):
    question: str
    answer: str

class AgentAnswer(BaseModel):
    answer: str
    references: list[str]
    compliance_category: str
    action_items: list[str]
    confidence: float

