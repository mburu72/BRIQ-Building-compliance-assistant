import os
import sys

import pytest
from httpx import AsyncClient, ASGITransport
from fastapi import status
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from main import app


@pytest.mark.asyncio
async def test_ask_question_creates_session_and_returns_answer():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.post(
            "/ask",
            headers={"X-Session-Id": "test-session-1"},
            json={"question": "Hello, my name is Edward"}
        )

    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert isinstance(data, dict)
    # Check structured keys
    assert "answer" in data
    assert "references" in data
    assert "compliance_category" in data


@pytest.mark.asyncio
async def test_same_session_retains_memory():
    session_id = "test-session-2"
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        await ac.post(
            "/ask",
            headers={"X-Session-Id": session_id},
            json={"question": "My name is Alice"}
        )

        res = await ac.post(
            "/ask",
            headers={"X-Session-Id": session_id},
            json={"question": "What is my name?"}
        )

    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert "Alice" in data["answer"]


@pytest.mark.asyncio
async def test_missing_session_header_fails():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.post("/ask", json={"question": "Hi"})

    assert res.status_code == status.HTTP_400_BAD_REQUEST
