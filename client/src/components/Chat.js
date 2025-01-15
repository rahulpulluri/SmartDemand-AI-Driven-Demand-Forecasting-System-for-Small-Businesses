import React, { useState, useEffect, useRef } from "react";
import "../styles/Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([
<<<<<<< HEAD
    { sender: "bot", text: "Hello! How can I assist you today? Ask me about business trends, metrics, customer impact, or insights!" },
=======
    {
      sender: "bot",
      text: "Hello! How can I assist you today? Ask me about business trends, metrics, customer impact, or insights!",
    },
>>>>>>> cbef87c (updated flask server)
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleInputChange = (e) => setInput(e.target.value);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages((prevMessages) => [...prevMessages, { sender: "user", text: input }]);
      setInput("");

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Analyzing your query..." },
      ]);

      try {
<<<<<<< HEAD
        const response = await fetch("http://127.0.0.1:5000/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: input }),
        });
=======
        // Use the environment variable for the API endpoint
        const response = await fetch(
          `${process.env.REACT_APP_AUTH_API_ENDPOINT}/llm-response`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ prompt: input }),
          }
        );
        
        
>>>>>>> cbef87c (updated flask server)

        const data = await response.json();
        const botReply = data.reply || "Sorry, I couldn't process that.";

        setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: botReply }]);
      } catch (error) {
        console.error("Error connecting to the server:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
<<<<<<< HEAD
          { sender: "bot", text: "Error: Unable to reach the server. Please try again later." },
=======
          {
            sender: "bot",
            text: "Error: Unable to reach the server. Please try again later.",
          },
>>>>>>> cbef87c (updated flask server)
        ]);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>Smart Chat</h2>
        <p>Ask about trends, metrics, or business insights</p>
      </div>
      <div className="chatbot-body">
        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chatbot-input">
          <input
            type="text"
            placeholder="Type your question..."
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSendMessage}>&#10148;</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
