// pages/chatroom.tsx
import { useState } from 'react';
import { useChat } from '../contexts/ChatContext'
import Banner from '../components/Banner';
import FriendInput from '../components/FriendInput';
import ChatWindow from '../components/ChatWindow';
import { ethers, getAddress, zeroPadValue, toUtf8Bytes } from 'ethers';
import ChatroomArtifact from '../abi/Chatroom.json';
import { useWallet } from '../contexts/WalletContext';

export default function Chatroom() {
  const [friendAddress, setFriendAddress] = useState<string>(''); // Address to chat with
  const [friendChain, setFriendChain] = useState<string>('');
  const [isFriend, setIsFriend] = useState<boolean | null>(null); // Whether the friend has added you
  const [chatInitialized, setChatInitialized] = useState<boolean>(false); // Whether the chat is initialized
  
  const [friendKey, setFriendKey] = useState<string>("");
  const [friendOappAddress, setFriendOappAddress] = useState<string>("");

  const {setKey, key, ECDH, userOappAddress } = useChat();
  const { account, network } = useWallet();


  //TODO: move to service
  // Handle initializing the chatroom after friend verification
  const initializeChatroom = async () => {
    // calculate mutual key
    // if (!ECDH) {
    //   console.error('ECDH instance not available');
    //   return;
    // }
    // try {
    //   const friendKeyBuffer = Buffer.from(friendKey, 'base64');
    //   const mutualKey: Buffer = ECDH.computeSecret(friendKeyBuffer);
    //   setKey(mutualKey.toString('base64'));
    // } catch (error) {
    //   console.error('Error computing the secret:', error);
    // }

    await setPeers();
    setChatInitialized(true);
  };

  const setPeers = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();

      console.log("userOappAddress:", userOappAddress)
      console.log("friendOappAddress:", friendOappAddress)
      if (!ethers.isAddress(userOappAddress) || !ethers.isAddress(friendOappAddress)) {
        throw new Error('Invalid address');
      }
  
      const OAppContract = new ethers.Contract(userOappAddress, ChatroomArtifact.abi, signer);
      const Eid = (friendChain === "sepolia") ? 40161 : 40231;
      const tx = await OAppContract.setPeer(Eid, addressToBytes32(friendOappAddress));
      await tx.wait();
  
      console.log('Peer set successfully');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const addressToBytes32 = (address: string): string => {
    const checksumAddress = getAddress(address);
    return zeroPadValue(checksumAddress, 32);
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
            setFriendKey={setFriendKey}
            setFriendOappAddress={setFriendOappAddress}
          />
        )}

        {/* Step 2: Chat functionality */}
        {chatInitialized && (
          <ChatWindow 
            userAddress= {account}
            friendAddress = {friendAddress}
            friendChain= {friendChain}
          />
        )}
      </div>
    </div>
  );
}
