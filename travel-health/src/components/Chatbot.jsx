import React, { useState } from "react";
import axios from "axios";

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
          model: "mistral-tiny", // Use your preferred Mistral model
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
    <div style={styles.container}>
      <div style={styles.header}>
        <span>Travel Health Assistant</span>
        <button onClick={onClose} style={styles.close}>
          ×
        </button>
      </div>

      <div style={styles.chatArea}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.role === "user" ? "#e0f7fa" : "#f1f1f1",
            }}
          >
            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>{" "}
            {msg.content}
          </div>
        ))}
        {loading && (
          <div style={styles.message}>
            <em>Typing...</em>
          </div>
        )}
      </div>

      <div style={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a question..."
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.send}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "absolute",
    right: "20px",
    bottom: "20px",
    width: "320px",
    height: "450px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    zIndex: 999,
  },
  header: {
    padding: "12px 16px",
    backgroundColor: "#1f2937",
    color: "white",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  close: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "20px",
    cursor: "pointer",
  },
  chatArea: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  inputArea: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ddd",
  },
  input: {
    flex: 1,
    padding: "8px",
    fontSize: "14px",
  },
  send: {
    marginLeft: "8px",
    padding: "8px 12px",
    backgroundColor: "#1f2937",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  message: {
    fontSize: "14px",
    padding: "6px 10px",
    borderRadius: "6px",
    maxWidth: "80%",
  },
};

export default Chatbot;
