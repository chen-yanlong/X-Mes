"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

interface Message {
  sender: string;
  content: string;
}

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [formInput, setFormInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  // Connect wallet function
  async function connectWallet() {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection); // Updated in ethers v6
      const signer = await provider.getSigner(); // getSigner is async in ethers v6
      const userAddress = await signer.getAddress(); // getAddress is async in ethers v6
      setAccount(userAddress);
    } catch (error) {
      console.error("Connection error:", error);
    }
  }

  // Simulate sending data to Sign Protocol
  const sendData = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!account) {
      console.error("No account connected");
      return;
    }

    // Simulate submitting data to Sign Protocol
    console.log(`Data sent: ${formInput}`);
    
    // Add the new message to the chat
    const newMessage: Message = { sender: account, content: formInput };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    setFormInput(''); // Clear input after submission
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Omni-Chain Chatroom</h1>

      {!account ? (
        <button
          onClick={connectWallet}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="mb-4">
          <p>Connected as: {account}</p>
        </div>
      )}

      {/* Form to send data */}
      {account && (
        <form onSubmit={sendData} className="mb-6">
          <input
            type="text"
            placeholder="Type your message..."
            value={formInput}
            onChange={(e) => setFormInput(e.target.value)}
            className="border rounded py-2 px-3"
            required
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
          >
            Send
          </button>
        </form>
      )}

      {/* Simple Chatroom */}
      <div className="border w-full max-w-xl p-4 bg-gray-100">
        <h2 className="text-xl font-semibold mb-2">Chatroom</h2>
        <div className="overflow-y-auto max-h-60">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div key={index} className="mb-2">
                <strong>{message.sender}:</strong> {message.content}
              </div>
            ))
          ) : (
            <p>No messages yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
