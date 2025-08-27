import sys
from pathlib import Path
from unittest.mock import AsyncMock
import pytest
from pydantic_ai import Agent

sys.path.append(str(Path(__file__).resolve().parent.parent))

@pytest.fixture(autouse=True)
def mock_agent_run(monkeypatch):
    async def fake_run(query, message_history=None, **kwargs):
        answer = "Hello! I don't know your name."

        if message_history:
            for msg in reversed(message_history):
                if hasattr(msg, "parts") and msg.parts:
                    content = getattr(msg.parts[0], "content", "")
                    if "Alice" in content:
                        answer = "Hello Alice! I remember you."
                        break
                    elif "Edward" in content:
                        answer = "Hello Edward! I'm BRIQ. How can I help?"
                        break

        output_data = {
            "answer": answer,
            "references": ["doc1.pdf", "doc2.pdf"],
            "compliance_category": "General",
            "action_items": ["Greet user"],
            "confidence": 0.95,
        }
        return type("Result", (), {"output": output_data})()

    monkeypatch.setattr(Agent, "run", AsyncMock(side_effect=fake_run))

