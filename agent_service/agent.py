import json
from typing import List

from pydantic_ai import Agent
from pydantic_ai.messages import UserPromptPart, ModelRequest, ModelResponse, TextPart
from pydantic_ai.models.google import GoogleModel
from pydantic_ai.providers.google import GoogleProvider

from core.logger import logger
from core.settings import settings
from core.utils import load_prompt
from crud.chats import load_messages, save_message
from docops.docops import collection
from models.models import AgentAnswer

model = GoogleModel(
    model_name='gemini-2.5-flash',
    provider=GoogleProvider(api_key=settings.G_A_K)
)
prompt = load_prompt('prompt.md')


async def retrieve_tool(query: str):
    results = collection.query(query_texts=[query], n_results=5)
    return results["documents"]


class MemoryAgent:
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.agent = Agent(
            name="BRIQ",
            model=model,
            system_prompt=prompt,
            tools=[retrieve_tool],
            output_type=AgentAnswer
        )
        self.conversation_memory: List[ModelRequest | ModelResponse] = self._load_memory()

    def _load_memory(self) -> List[ModelRequest | ModelResponse]:
        history = []
        rows = load_messages(self.session_id)
        for role, content_str in rows:
            try:
                content_data = json.loads(content_str)
            except json.JSONDecodeError:
                content_data = {"question": content_str} if role == "user" else {"answer": content_str}

            if role == "user":
                history.append(ModelRequest(parts=[UserPromptPart(content=content_data["question"])]))
            elif role == "assistant":
                answer_text = content_data.get("answer", "")
                history.append(ModelResponse(parts=[TextPart(content=answer_text)]))
        return history

    async def chat(self, query: str) -> AgentAnswer:

        result = await self.agent.run(query, message_history=self.conversation_memory)
        structured_answer: AgentAnswer = result.output
        logger.info(f"Answer: {structured_answer}")
        answer_text = structured_answer


        save_message(self.session_id, "user", query)
        save_message(self.session_id, "assistant", answer_text.answer)

        self.conversation_memory.append(ModelRequest(parts=[UserPromptPart(content=query)]))
        self.conversation_memory.append(ModelResponse(parts=[TextPart(content=answer_text.answer)]))

        return structured_answer
