const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Support Chatbot Backend is running");
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: message,
        stream: false
      })
    });

    const data = await response.json();

    res.json({
      reply: data.response
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      reply: "Sorry, I couldn't process your question."
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});