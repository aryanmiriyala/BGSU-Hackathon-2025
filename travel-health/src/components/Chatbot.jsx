import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./Chatbot.module.css";
import { FiMaximize2, FiMinimize2, FiX } from "react-icons/fi";
import ReactMarkdown from "react-markdown"; // ✅ Markdown support

const Chatbot = ({ open, onClose, userId, maximized, onToggleMaximize }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! Ask me anything about your travel health.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userContext, setUserContext] = useState("");

  // Create a ref to the chat area container for scrolling
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchUserHealthData = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`http://localhost:5020/api/health/${userId}`);
        if (!res.ok) return;
        const data = await res.json();
        const context = Object.entries(data)
          .map(([key, value]) => {
            if (Array.isArray(value)) return `${key}: ${value.join(", ")}`;
            return `${key}: ${value}`;
          })
          .join("\n");
        setUserContext(context);
      } catch (error) {
        console.error("Error loading user health data:", error);
      }
    };
    fetchUserHealthData();
  }, [userId]);

  // Scroll to the bottom of the chat area whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const messagesWithContext = [
        {
          role: "system",
          content:
            "You are a helpful travel health assistant. Keep your answers short and concise using bullet points or headings if necessary. Focus only on the most relevant and actionable information. Use markdown formatting when appropriate.",
        },
        ...updatedMessages,
      ];

      const response = await axios.post(
        "https://api.mistral.ai/v1/chat/completions",
        {
          model: "mistral-large-latest",
          messages: messagesWithContext,
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiReply = response.data.choices[0].message;
      setMessages([...updatedMessages, aiReply]);
    } catch (err) {
      console.error("Mistral error:", err);
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Oops! Something went wrong while processing your request.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className={`${styles.container} ${maximized ? styles.maximized : ""}`}>
      <div className={styles.header}>
        <span>Travel Health Assistant</span>
        <div className={styles.controls}>
          <button
            onClick={onToggleMaximize}
            className={styles.iconButton}
            title={maximized ? "Collapse" : "Maximize"}
          >
            {maximized ? <FiMinimize2 /> : <FiMaximize2 />}
          </button>
          <button onClick={onClose} className={styles.iconButton} title="Close">
            <FiX />
          </button>
        </div>
      </div>

      <div className={styles.chatArea}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={styles.message}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.role === "user" ? "#e0f7fa" : "#f1f1f1",
            }}
          >
            {/* Render message with ReactMarkdown for proper formatting */}
            <ReactMarkdown children={msg.content} skipHtml />
          </div>
        ))}
        {loading && (
          <div className={styles.message}>
            <em>Typing...</em>
          </div>
        )}
        {/* Scroll to the bottom */}
        <div ref={chatEndRef} />
      </div>

      <div className={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a question..."
          className={styles.input}
        />
        <button onClick={handleSend} className={styles.send}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
