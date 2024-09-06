import { ethers } from 'ethers';

/**
 * Sends a friend request by signing an attestation.
 * @param friendAddress The address of the friend to whom the request is being sent.
 */
export async function sendFriendRequest(friendAddress: string) {
  try {
    // Ensure Ethereum provider is available (MetaMask, etc.)
    if (!window.ethereum) {
      throw new Error('Ethereum provider not available');
    }

    // Initialize provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Get the user's address (signer's address)
    const userAddress = await signer.getAddress();

    // Create a message that attests the friend request
    const message = `I, ${userAddress}, want to add ${friendAddress} as a friend.`;

    // Sign the message
    const signature = await signer.signMessage(message);

    // Now you can send the `friendAddress`, `userAddress`, and `signature` to a backend or smart contract
    // Example: send to your backend for verification or save as an event in the blockchain
    const result = await submitToBackendOrContract(userAddress, friendAddress, signature);

    return result; // Return the result, can be success message or other details

  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
}

/**
 * Example function for submitting signed data to a backend or contract.
 * Replace this with your actual implementation.
 */
async function submitToBackendOrContract(userAddress: string, friendAddress: string, signature: string) {
  // Example: Send the signed message to a backend or call a smart contract
  console.log('Submitting to backend or contract:', { userAddress, friendAddress, signature });
  
  // Perform the submission logic (e.g., API call or smart contract transaction)
  // You may replace this with your actual backend or smart contract interaction.
  
  // Simulating a successful response
  return {
    success: true,
    message: 'Friend request submitted successfully!',
  };
}
