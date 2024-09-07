import { useState } from 'react';
import Banner from '../components/Banner';
import { sendFriendRequest } from '../services/friendService';
import { useWallet } from '../contexts/WalletContext';
import { useChat } from '../contexts/ChatContext'

export default function FriendRequest() {
  const [friendAddress, setFriendAddress] = useState('');
  const [chain, setChain] = useState(''); // State for storing the selected chain
  const [statusMessage, setStatusMessage] = useState(''); // To show success/failure messages
  const { account, network, connectWallet } = useWallet();


  const handleSendRequest = async () => {

    try {
      // Call the service function and pass the friendAddress and chain
      await sendFriendRequest(account, network, friendAddress, chain);
      setStatusMessage(`Friend request sent to ${friendAddress} on ${chain} successfully!`);
    } catch (error) {
      setStatusMessage(`Failed to send friend request: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Banner />
      <div className="text-center mt-12">
        <h2 className="text-3xl font-bold mb-6">Send Friend Request</h2>

        {/* Input for friend's address */}
        <input
          type="text"
          placeholder="Enter friend's address"
          value={friendAddress}
          onChange={(e) => setFriendAddress(e.target.value)}
          className="border rounded p-2 w-80 mb-4"
        />
        <br />

        {/* Input for chain */}
        <input
          type="text"
          placeholder="Enter chain (e.g., Ethereum, Binance, Polygon)"
          value={chain}
          onChange={(e) => setChain(e.target.value)}
          className="border rounded p-2 w-80 mb-4"
        />
        <br />

        {/* Button to send friend request */}
        <button 
          onClick={handleSendRequest} 
          className="bg-blue-500 text-white font-semibold py-2 px-6 rounded shadow-md hover:bg-blue-600 transition-colors"
        >
          Send Request
        </button>

        {/* Status message */}
        {statusMessage && (
          <p className="text-lg font-medium mt-4">{statusMessage}</p>
        )}
      </div>
    </div>
  );
}
