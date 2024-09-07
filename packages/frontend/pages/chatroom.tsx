// pages/chatroom.tsx
import { useState } from 'react';
import Banner from '../components/Banner';
import FriendInput from '../components/FriendInput';
import ChatWindow from '../components/ChatWindow';

export default function Chatroom() {
  const [friendAddress, setFriendAddress] = useState<string>(''); // Address to chat with
  const [friendChain, setFriendChain] = useState<string>('');
  const [isFriend, setIsFriend] = useState<boolean | null>(null); // Whether the friend has added you
  const [chatInitialized, setChatInitialized] = useState<boolean>(false); // Whether the chat is initialized
  const [key, setKey] = useState<string>("");
  

  // Handle initializing the chatroom after friend verification
  const initializeChatroom = () => {
    setChatInitialized(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Banner />
      <div className="text-center mt-12">
        <h2 className="text-3xl font-bold mb-6">Chatroom</h2>

        {/* Step 1: Friend Input and Check Status */}
        {!chatInitialized && (
          <FriendInput
            friendAddress={friendAddress}
            friendChain={friendChain}
            setFriendChain={setFriendChain}
            setFriendAddress={setFriendAddress}
            setIsFriend={setIsFriend}
            isFriend={isFriend}
            initializeChatroom={initializeChatroom}
          />
        )}

        {/* Step 2: Chat functionality */}
        {chatInitialized && (
          <ChatWindow 
            friendAddress = {friendAddress}
          />
        )}
      </div>
    </div>
  );
}
