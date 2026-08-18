import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! 👋 I'm your AI Support Assistant. How can I help you?"
    }
  ]);

  const [input, setInput] = useState("");
  const clearChat = () => {
  setMessages([
    {
      sender: "bot",
      text: "Hello! 👋 I'm your AI Support Assistant. How can I help you?"
    }
  ]);
};
  const [isTyping, setIsTyping] = useState(false);
  const sendMessage = async () => {
  if (input.trim() === "") return;

  const userMessage = {
    sender: "user",
    text: input
  };

  setMessages((previous) => [...previous, userMessage]);

  const currentInput = input;
  setInput("");
  setIsTyping(true);
  try {
    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: currentInput
      })
    });

    const data = await response.json();
    setIsTyping(false);
    const botMessage = {
      sender: "bot",
      text: data.reply
    };

    setMessages((previous) => [...previous, botMessage]);
  } catch (error) {
    console.error("Error:", error);
    setIsTyping(false); 
    const botMessage = {
      sender: "bot",
      text: "Sorry, I couldn't connect to the server."
    };

    setMessages((previous) => [...previous, botMessage]);
  }
};

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="app">
      <div className="chat-container">

        <header className="chat-header">
          <div>
            <h1>AI Support Assistant</h1>
            <p>Ask me anything</p>
          </div>
          <span className="status">● Online</span>
          <button className="clear-button" onClick={clearChat}>
      Clear Chat
    </button>
        </header>

        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.sender === "user" ? "user-message" : "bot-message"
              }`}
            >
              <span className="sender">
                {message.sender === "user" ? "You" : "AI"}
              </span>
              <p>{message.text}</p>
            </div>
          ))}
          {isTyping && (
  <div className="message bot-message typing">
    <span className="sender">AI</span>
    <p>AI is typing...</p>
  </div>
)}
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Type your question..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyPress}
          />

          <button onClick={sendMessage}>
            Send
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;