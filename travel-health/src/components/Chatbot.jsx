import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
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

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

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
    <div
      className={`${styles.container} ${
        maximized ? styles.maximized : styles.minimized
      }`}
    >
      <div className={styles.header}>
        <span>Travel Health Assistant</span>
        <div>
          <button
            onClick={() => setMaximized((prev) => !prev)}
            className={styles.headerButton}
            title={maximized ? "Minimize" : "Maximize"}
          >
            {maximized ? "🗕" : "🗖"}
          </button>
          <button onClick={onClose} className={styles.close}>
            ×
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

        {loading && (
          <div className={styles.typingAnimation}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>
        )}

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
