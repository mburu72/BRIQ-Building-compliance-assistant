"use client";

import { useState } from "react";

export default function Sidebar({
  chats = [],
  onSelectChat,
  onNewChat,
  isOpen,
  toggleSidebar,
}) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity sm:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />

      <aside
        className={`fixed sm:static top-0 left-0 h-full w-64 bg-gray-900 text-white border-r border-gray-800 transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="text-lg font-bold text-red-500">Chat History</div>
          <button
            className="sm:hidden text-gray-400 hover:text-white"
            onClick={toggleSidebar}
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={() => {
              onNewChat();
              toggleSidebar();
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition"
          >
            + New Chat
          </button>
        </div>

        <ul className="space-y-1 p-4 overflow-y-auto h-[calc(100%-10rem)]">
          {chats.length === 0 && (
            <li className="text-sm text-gray-500">No previous chats</li>
          )}
          {chats.map((chat, idx) => (
            <li
              key={idx}
              onClick={() => {
                onSelectChat(chat);
                toggleSidebar();
              }}
              className="cursor-pointer text-sm p-2 rounded hover:bg-gray-800 border border-gray-700 transition"
            >
              {chat.question.slice(0, 40)}...
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
