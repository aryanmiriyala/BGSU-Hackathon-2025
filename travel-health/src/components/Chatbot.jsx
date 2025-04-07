import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./Chatbot.module.css";
import { FiMaximize2, FiMinimize2, FiX } from "react-icons/fi";
import ReactMarkdown from "react-markdown";

const Chatbot = ({ open, onClose, userId, maximized, onToggleMaximize }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! Ask me anything about your travel health.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userHealth, setUserHealth] = useState(null);
  const chatEndRef = useRef(null);

  // Fetch user health data from the backend when the component mounts or when userId changes
  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5020/api/health/${userId}`)
        .then((response) => {
          setUserHealth(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user health data:", error);
        });
    }
  }, [userId]);

  // Build user context from the fetched health data
  const userContext = userHealth
    ? Object.entries(userHealth)
        .map(([key, value]) => {
          if (Array.isArray(value)) return `${key}: ${value.join(", ")}`;
          return `${key}: ${value}`;
        })
        .join("\n")
    : "";

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
          content: `You are a helpful travel health assistant. Keep your answers short and actionable. Use markdown when helpful.

User Health Profile:
${userContext}
          `,
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
            <ReactMarkdown children={msg.content} skipHtml />
          </div>
        ))}
        {loading && (
          <div className={styles.message}>
            <em>Typing...</em>
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
