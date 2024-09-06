// services/chatService.ts
import { ethers } from 'ethers';
// import { contractABI, contractAddress } from '../config/contractConfig';

export const getChatHistory = async () => {
//   try {
//     const provider = new ethers.BrowserProvider(window.ethereum); 
//     const contract = new ethers.Contract(contractAddress, contractABI, provider);

//     // Fetch past events (replace 'MessageSent' with your event name)
//     const events = await contract.queryFilter(contract.filters.MessageSent(), 0, 'latest');

//     return events.map((event: any) => ({
//       sender: event.args.sender,
//       content: event.args.message,
//       timestamp: event.args.timestamp.toNumber() * 1000, // Convert to milliseconds for JavaScript Date
//     }));
//   } catch (error) {
//     console.error('Error fetching chat history:', error);
//     return [];
//   }
return []
};
