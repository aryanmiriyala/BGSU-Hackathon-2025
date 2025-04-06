import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiX, FiSend, FiMaximize2, FiMinimize2 } from "react-icons/fi";
import styles from "./Chatbot.module.css";

const Chatbot = ({ open, onClose, userId, maximized, setMaximized }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! Ask me anything about your travel health.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userContext, setUserContext] = useState("");

  useEffect(() => {
    if (!userId) return;
    const fetchUserHealthData = async () => {
      try {
        const res = await fetch(`http://localhost:5020/api/health/${userId}`);
        if (!res.ok) return;
        const data = await res.json();
        const context = Object.entries(data)
          .map(
            ([key, value]) =>
              `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
          )
          .join("\n");
        setUserContext(context);
      } catch (error) {
        console.error("Error fetching health data:", error);
      }
    };
    fetchUserHealthData();
  }, [userId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const messagesWithContext = [
        {
          role: "system",
          content: `You are a helpful travel health assistant. Personalize responses:\n\n${userContext}`,
        },
        ...messages,
        userMessage,
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
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Oops! Something went wrong." },
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
        <div className={styles.headerButtons}>
          <button
            onClick={() => setMaximized(!maximized)}
            className={styles.iconButton}
          >
            {maximized ? <FiMinimize2 /> : <FiMaximize2 />}
          </button>
          <button onClick={onClose} className={styles.iconButton}>
            <FiX />
          </button>
        </div>
      </div>

      <div className={styles.chatArea}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${styles.message} ${
              msg.role === "user" ? styles.userMessage : styles.botMessage
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className={styles.typing}>Typing...</div>}
      </div>

      <div className={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a question..."
          className={styles.input}
        />
        <button onClick={handleSend} className={styles.sendButton}>
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
