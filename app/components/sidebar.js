"use client";

export default function Sidebar({ chats = [], onSelectChat, isOpen, toggleSidebar }) {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity sm:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <aside
        className={`fixed sm:static top-0 left-0 h-full w-64 bg-gray-900 text-white border-r border-gray-800 transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="text-lg font-bold text-red-500">Chat History</div>
          {/* Close button (mobile only) */}
          <button
            className="sm:hidden text-gray-400 hover:text-white"
            onClick={toggleSidebar}
          >
            ✕
          </button>
        </div>

        {/* Chat list */}
        <ul className="space-y-1 p-4 overflow-y-auto h-[calc(100%-3.5rem)]">
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
