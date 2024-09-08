import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ChatroomArtifact from '../abi/Chatroom.json'; 
import { useChat } from '../contexts/ChatContext';
import { Options } from '@layerzerolabs/lz-v2-utilities';
import { AbiCoder } from 'ethers';

interface ChatWindowProps {
  userAddress: string; // My address
  friendAddress: string; // Friend's address
  friendChain: string;
}

export default function ChatWindow({ userAddress, friendAddress, friendChain }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ sender: string; content: string; timestamp: number }[]>([]);
  const { userOappAddress } = useChat();

  // Fetch chat history on load
  useEffect(() => {
    const loadChatHistory = async () => {
      if (userOappAddress) {
        await refreshChatHistory(); // Initial load
      }
    };
    loadChatHistory();
  }, [userOappAddress]);

  const sendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        sender: userAddress,
        content: message,
        timestamp: Date.now(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Add message locally
      setMessage(''); // Clear input field

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
    
        // Create a new instance of the contract
        const contract = new ethers.Contract(userOappAddress, ChatroomArtifact.abi, signer);
    
        // Encode the message
        const payload = ethers.AbiCoder.defaultAbiCoder().encode(['string'], [message]);
        const dstEid = (friendChain === "sepolia") ? 40161 : 40231;
        const options = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex().toString();
        
        // Fetch the quote for the fee
        const [nativeFee] = await contract.quote(dstEid, payload, options, false);
        
        // Send the message
        const tx = await contract.send(dstEid, payload, options, { value: nativeFee });
        await tx.wait();

        console.log('Message sent successfully');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  // Function to refresh the chat history
  const refreshChatHistory = async () => {
    try {
      if (userOappAddress) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(userOappAddress, ChatroomArtifact.abi, provider);
        
        // Fetch all messages directly from the contract
        const messagesFromContract = await contract.data(); 
        const abiCoder = new AbiCoder();

        // Assuming `data` returns an array of messages, decode each one
        // Define the expected data type, which is 'string'
        const decodedMessage = abiCoder.decode(['string'], messagesFromContract);
        const timestamp = Math.floor(Date.now() / 1000);
        const newMessage = {
          sender:friendAddress,
          content: decodedMessage[0],
          timestamp
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);

      }
    } catch (error) {
      console.error('Error refreshing chat history:', error);
    }
  };

  return (
    <div className="mt-8 p-4 bg-white shadow-md rounded-md w-full max-w-lg mx-auto">
      <div className="text-center text-lg font-semibold mb-4">
        Chat with {friendAddress}
      </div>

      <div className="overflow-y-auto h-80 mb-4 bg-gray-100 p-4 rounded-md">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className={`mb-2 flex ${msg.sender === userAddress ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`p-3 rounded-lg max-w-xs ${msg.sender === userAddress ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
              >
                <p>{msg.content}</p>
                <small className="block text-xs text-right mt-1">
                  {new Date(msg.timestamp * 1000).toLocaleTimeString()}
                </small>
              </div>
            </div>
          ))
        ) : (
          <p>No messages yet</p>
        )}
      </div>

      <div className="flex mb-4">
        <button onClick={refreshChatHistory} className="bg-gray-500 text-white font-semibold py-2 px-4 rounded">
          Refresh Chat
        </button>
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
