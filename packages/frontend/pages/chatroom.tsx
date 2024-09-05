// pages/chatroom.tsx
import { useState } from 'react';
import Banner from '../components/Banner';

export default function Chatroom() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, message]);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Banner />
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Chatroom</h2>
        <input
          type="text"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ padding: '10px', width: '300px', marginBottom: '10px' }}
        />
        <br />
        <button onClick={sendMessage} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Send Message
        </button>
        <div style={{ marginTop: '20px' }}>
          {messages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
