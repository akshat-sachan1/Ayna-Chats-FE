import React, { useEffect, useState } from 'react';
import './Chat.css';

const Chat = ({ auth, selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      const ws = new WebSocket(`ws://localhost:8080/${auth.user.id}`);
      setWs(ws);

      ws.onopen = () => {
        console.log('Connected to the WebSocket server');
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.senderId === selectedUser.id || message.recipientId === auth.user.id) {
            setMessages((prevMessages) => [...prevMessages, message]);
          }
        } catch (e) {
          console.log('Received non-JSON message:', event.data);
        }
      };

      return () => {
        ws.close();
      };
    }
  }, [selectedUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ws && selectedUser) {
      const message = {
        recipientId: selectedUser.id,
        senderId: auth.user.id,
        content: input,
        timestamp: new Date().toLocaleTimeString(),
      };
      ws.send(JSON.stringify(message));
      setMessages((prevMessages) => [...prevMessages, message]);
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <ul className="messages">
        {messages.map((msg, index) => (
          <li key={index} className={msg.senderId === auth.user.id ? 'sent' : 'received'}>
            <div className="message-content">{msg.content}</div>
            <div className="timestamp">{msg.timestamp}</div>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
