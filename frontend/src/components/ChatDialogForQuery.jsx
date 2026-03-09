import React, { useEffect, useState } from "react";
import { api } from "../axiosSetup";
import { API_ENDPOINT } from "../apiEndpoints";
import toast from "react-hot-toast";

function QueryChatDialog({ isOpen, queryId, onClose,role }) {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const res = await api.get(
		role ==="admin" ? API_ENDPOINT.getQueryMessageForAdmin(queryId):API_ENDPOINT.getQueryMessageForUser(queryId));
      if (res.data.success) {
        setMessages(res.data.results);
      }
    } catch (error) {
      toast.error("Failed to load messages");
    }
  };

  useEffect(() => {
    if (isOpen && queryId) {
      fetchMessages();
    }
  }, [isOpen, queryId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1e293b] w-full max-w-2xl rounded-2xl border border-slate-800 shadow-2xl p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-bold uppercase text-sm tracking-widest">
            Query Conversation
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs"
          >
            Close
          </button>
        </div>

        {/* Chat Area */}
        <div className="h-96 overflow-y-auto space-y-4 pr-2">

          {messages.length === 0 ? (
            <div className="text-slate-500 text-center text-sm">
              No messages yet.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.senderRole === "admin"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-xl text-sm ${
                    msg.senderRole === "admin"
                      ? "bg-sky-500 text-black"
                      : "bg-slate-700 text-white"
                  }`}
                >
                  {msg.message}

                  {msg.attachment && (
                    <div className="mt-2">
                      <a
                        href={`http://localhost:3001${msg.attachment}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs underline"
                      >
                        View Attachment
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default QueryChatDialog;
