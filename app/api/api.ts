import { getSessionId } from "../utils/sessionId";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function askQuestion(question) {
  const sessionId = getSessionId();
  if (!sessionId) throw new Error("Session ID unavailable");

  const res = await fetch(`${BASE_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Session-Id": sessionId,
    },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API Error: ${res.status} - ${errText}`);
  }
  const data = await res.json();

  // Return the whole structured response
  return data;
}

export async function fetchHistory() {
  const sessionId = getSessionId();
  if (!sessionId) throw new Error("Session ID unavailable");

  const res = await fetch(`${BASE_URL}/history`, {
    headers: { "X-Session-Id": sessionId },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch chat history: ${res.status}`);
  }
  let chats=await res.json();
  console.log(chats);
  
  return chats
}
