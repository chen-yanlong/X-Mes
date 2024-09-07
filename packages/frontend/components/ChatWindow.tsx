import { useEffect, useState } from 'react';
import { getChatHistory } from '../services/chatService'; 
import { ethers } from 'ethers';
import ChatroomArtifact from '../abi/ChatRoom.json'; 
import { useChat } from '../contexts/ChatContext';
import { Options } from '@layerzerolabs/lz-v2-utilities'
interface ChatWindowProps {
  userAddress: string; // My address
  friendAddress: string; // Friend's address
  friendChain: string
}

export default function ChatWindow({ userAddress, friendAddress, friendChain }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ sender: string; content: string; timestamp: number }[]>([]);
  const { userOappAddress } = useChat();

  // Fetch chat history on load
  useEffect(() => {
    async function loadChatHistory() {
      const history = await getChatHistory(userOappAddress);
      setMessages(history);
    }
    loadChatHistory();
  }, []);

  const sendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        sender: userAddress,
        content: message,
        timestamp: Date.now(),
      };
      setMessages([...messages, newMessage]); // Add message locally
      
      try {
        console.log("message:", message)
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
    
        // Create a new instance of the contract
        const contract = new ethers.Contract(userOappAddress, ChatroomArtifact.abi, signer);
    
        // Encode the message
        const payload = ethers.AbiCoder.defaultAbiCoder().encode(['string'], [message]);
        const dstEid = (friendChain === "sepolia") ? 40161 : 40231;
        const options = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex().toString()
        let nativeFee = 0
        ;[nativeFee] = await contract.quote(dstEid, message, options, false)
        const tx = await contract.send(dstEid, message, options, { value: nativeFee.toString() })
        await tx.wait();

        console.log('Message sent successfully');
      } catch (error) {
        console.error('Error sending message:', error);
      }
      setMessage(''); 
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
