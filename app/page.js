'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Send, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { askQuestion, fetchHistory } from "./api/api";
import Sidebar from "./components/sidebar";

export default function MinimalChat() {
  const [chatMessage, setChatMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchHistory()
      .then((hist) => {
        setMessages(hist);
        setChats(hist); 
      })
      .catch((err) => console.error("⚠️ history fetch failed:", err));
  }, []);

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMessage = {
      id: uuidv4(),
      type: "user",
      text: chatMessage,
    };
    setMessages((prev) => [...prev, userMessage]);
    setChatMessage("");
    setLoading(true);
    setError("");

    try {
      const answerData = await askQuestion(chatMessage);

      const botMessage = {
        id: uuidv4(),
        type: "bot",
        data: answerData, // store structured response
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to get a response from BRIQ.");
    } finally {
      setLoading(false);
    }
  };

  
  const handleSelectChat = (chat) => {
    let parsedAnswer;
  
    try {
      parsedAnswer = JSON.parse(chat.answer); // structured messages
    } catch {
      parsedAnswer = { answer: chat.answer }; // plain string messages
    }
  
    setMessages([
      { id: uuidv4(), type: "user", text: chat.question },
      { id: uuidv4(), type: "bot", data: parsedAnswer },
    ]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        onSelectChat={handleSelectChat}
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Mobile open button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow sm:hidden"
      >
        ☰
      </button>

      {/* Main Chat Area */}
      <div className="flex-1 relative">
        <div className="max-w-4xl mx-auto pt-10 pb-36 px-4">
          {messages.length === 0 && !loading && !error && (
            <div className="text-center text-gray-400 py-16">
              <MessageCircle size={48} className="mx-auto mb-4" />
              <p className="text-lg mb-2">Ready to help with your compliance questions</p>
              <p className="text-sm">Start a conversation by asking a question below.</p>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 rounded-lg text-sm leading-relaxed my-2 break-words overflow-hidden ${
                msg.type === "bot"
                  ? "bg-gray-900/50 border border-gray-700/50 text-white max-w-full sm:max-w-2xl"
                  : "bg-gray-800 text-gray-300 text-right ml-auto w-fit max-w-full sm:max-w-2xl whitespace-pre-wrap"
              }`}
            >
              {msg.type === "bot" && msg.data ? (
                <div className="space-y-2">
                  <div>{msg.data.answer}</div>

                  {msg.data.references?.length > 0 && (
                    <div>
                      <strong>References:</strong>
                      <ul className="list-disc list-inside break-words">
                        {msg.data.references.map((ref, i) => (
                          <li key={i}>{ref}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {msg.data.compliance_category && (
                    <div>
                      <strong>Category:</strong> {msg.data.compliance_category}
                    </div>
                  )}

                  {msg.data.action_items?.length > 0 && (
                    <div>
                      <strong>Action Items:</strong>
                      <ul className="list-decimal list-inside break-words">
                        {msg.data.action_items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {msg.data.confidence !== undefined && (
                    <div>
                      <strong>Confidence:</strong> {(msg.data.confidence * 100).toFixed(0)}%
                    </div>
                  )}
                </div>
              ) : msg.type === "bot" ? (
                <ReactMarkdown
                  components={{
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        className="text-red-400 underline hover:text-red-300 break-words"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}
            </div>
          ))}

          {loading && (
            <div className="text-gray-400 text-sm py-4 animate-pulse">BRIQ is thinking…</div>
          )}
          {error && <div className="text-red-400 text-sm py-4">{error}</div>}
        </div>

        {/* Input Box */}
        <div className="fixed bottom-6 left-4 right-4 sm:left-72 sm:right-6 max-w-4xl mx-auto">
          <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 shadow-2xl">
            <div className="relative">
              <textarea
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question..."
                className="w-full pr-12 px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:border-red-500/50 focus:outline-none resize-none max-h-32 min-h-[48px] overflow-hidden"
                rows={1}
                style={{ height: "auto", minHeight: "48px" }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatMessage.trim()}
                className="absolute right-2 bottom-4 p-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
              <span>{chatMessage.length}/1000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
