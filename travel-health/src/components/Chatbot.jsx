import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Chatbot.module.css";

const Chatbot = ({ open, onClose, userId }) => {
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
            "You are a helpful travel health assistant. Use the following user health info to personalize responses:\n\n" +
            (userContext || "No user-specific context available."),
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
    <div className={styles.container}>
      <div className={styles.header}>
        <span>Travel Health Assistant</span>
        <button onClick={onClose} className={styles.close}>
          ×
        </button>
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
            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>{" "}
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className={styles.message}>
            <em>Typing...</em>
          </div>
        )}
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
