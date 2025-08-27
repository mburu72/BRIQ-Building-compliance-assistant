import json

from core.database import get_db


def save_message(session_id: str, role: str, content: dict | str):

    if isinstance(content, dict):
        content_to_store = json.dumps(content)
    else:
        content_to_store = content

    print(f"Saving: session_id={session_id}, role={role}, content={content_to_store}")

    with get_db() as db:  # assuming get_db() yields a Session
        db.execute(
            "INSERT INTO chat_memory (session_id, role, content) VALUES (?, ?, ?)",
            (session_id, role, content_to_store)
        )
        db.commit()  # commit changes

def load_messages(session_id: str):
    with get_db() as db:
        rows = db.execute(
            "SELECT role, content FROM chat_memory WHERE session_id = ? ORDER BY id ASC",
            (session_id,)
        ).fetchall()
        return [(row["role"], row["content"]) for row in rows]
