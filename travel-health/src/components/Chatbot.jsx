import React, { useState } from "react";
import axios from "axios";
import styles from "./Chatbot.module.css"; // use the CSS Module

const Chatbot = ({ open, onClose }) => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me anything about travel health." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.mistral.ai/v1/chat/completions",
        {
          model: "mistral-large-latest",
          messages: updatedMessages,
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
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Oops! Something went wrong. Please try again later.",
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
