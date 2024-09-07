import { ethers } from 'ethers';
import ChatroomArtifact from '../abi/ChatRoom.json';

export const getChatHistory = async (userOappAddress: string) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum); 
    const contract = new ethers.Contract(userOappAddress, ChatroomArtifact.abi, provider);

    const events = await contract.queryFilter(contract.filters.MessageSent(), 0, 'latest');

    return events.map((event: any) => ({
      sender: event.args.sender,
      content: event.args.message,
      timestamp: event.args.timestamp.toNumber() * 1000, 
    }));
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
return []
};
