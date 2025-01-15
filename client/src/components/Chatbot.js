import React, { useState } from "react";
import "../styles/Chatbot.css";
import { BsChatDotsFill } from "react-icons/bs";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const handleInputChange = (e) => setInput(e.target.value);

  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: input },
      ]);
      setInput("");

      // Temporary response while waiting for the server
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

        const data = await response.json();
        const llmReply = data.reply || "Sorry, I couldn't process that."; // Adjust to match Flask response
=======
        // Call the updated Node.js API with environment variable and token
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

        const data = await response.json();
        const llmReply = data.reply || "Sorry, I couldn't process that.";
>>>>>>> cbef87c (updated flask server)

        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: llmReply },
        ]);
      } catch (error) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: "Error: Unable to reach the server." },
        ]);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
      {!isOpen && (
        <div className="chatbot-closed" onClick={toggleChat}>
          <BsChatDotsFill size={30} />
        </div>
      )}
      {isOpen && (
        <>
          <div className="chatbot-header" onClick={toggleChat}>
            <span className="chatbot-title">InsightPro</span>
          </div>
          <div className="chatbot-body">
            <div className="chatbot-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="chatbot-input">
              <input
                type="text"
                placeholder="Type your message here..."
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
              <button onClick={handleSendMessage}>&#10148;</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;
