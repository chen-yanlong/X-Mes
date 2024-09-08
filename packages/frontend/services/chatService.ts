import { ethers } from 'ethers';
import ChatroomArtifact from '../abi/Chatroom.json';

export const getChatHistory = async (userOappAddress: string) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum); 
    const contract = new ethers.Contract(userOappAddress, ChatroomArtifact.abi, provider);

    // Fetch events
    const events = await contract.queryFilter(contract.filters.MessageSent(), 0, 'latest');

    // Map over events to extract relevant data
    return events.map((event: any) => {
      const timestamp = event.args.timestamp;

      return {
        sender: event.args.sender,
        content: event.args.message,
        timestamp // Convert timestamp to milliseconds
      };
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
};
