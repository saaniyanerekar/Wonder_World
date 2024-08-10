const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const historyFilePath = path.join(__dirname, 'chatHistory.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Load chat history
const loadChatHistory = () => {
  if (fs.existsSync(historyFilePath)) {
    const data = fs.readFileSync(historyFilePath);
    return JSON.parse(data);
  }
  return [];
};

// Save chat history
const saveChatHistory = (history) => {
  fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2));
};

// Endpoint to get chat history
app.get('/api/history', (req, res) => {
  const history = loadChatHistory();
  res.json(history);
});

// Endpoint to send a chat message
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  const history = loadChatHistory();

  const userMessage = { sender: 'user', text: message, timestamp: new Date() };
  history.push(userMessage);

  try {
    const response = await axios.post('https://api.gemini.com/v1/chat', {
      message: message
    }, {
      headers: {
        'Authorization': `AIzaSyDuOf6eXyu_pqTCMa5aH3YcXBe6RrVSxy0`
      }
    });

    const botMessage = { sender: 'bot', text: response.data.response, timestamp: new Date() };
    history.push(botMessage);

    saveChatHistory(history);

    res.json(response.data);
  } catch (error) {
    console.error(error);
    const errorMessage = { sender: 'bot', text: 'Something went wrong. Please try again.', timestamp: new Date() };
    history.push(errorMessage);
    saveChatHistory(history);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
