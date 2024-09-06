import { useEffect, useState } from 'react';
import { getChatHistory } from '../services/chatService'; // Import the helper function

interface ChatWindowProps {
  userAddress: string; // My address
  friendAddress: string; // Friend's address
}

export default function ChatWindow({ userAddress, friendAddress }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ sender: string; content: string; timestamp: number }[]>([]);

  // Fetch chat history on load
  useEffect(() => {
    async function loadChatHistory() {
      const history = await getChatHistory(); // Fetch history from contract
      setMessages(history);
    }
    loadChatHistory();
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        sender: userAddress,
        content: message,
        timestamp: Date.now(),
      };
      setMessages([...messages, newMessage]); // Add message locally
      setMessage(''); // Clear input
      // Here you would also send the message to the contract
    }
  };

  return (
    <div className="mt-8 p-4 bg-white shadow-md rounded-md w-full max-w-lg mx-auto">
      <div className="text-center text-lg font-semibold mb-4">
        Chat with {friendAddress}
      </div>

      <div className="overflow-y-auto h-80 mb-4 bg-gray-100 p-4 rounded-md">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 flex ${msg.sender === userAddress ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`p-3 rounded-lg max-w-xs ${msg.sender === userAddress ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
            >
              <p>{msg.content}</p>
              <small className="block text-xs text-right mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </small>
            </div>
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border rounded-l p-2 w-full"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-r">
          Send
        </button>
      </div>
    </div>
  );
}
