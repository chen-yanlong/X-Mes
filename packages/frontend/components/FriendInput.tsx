// components/FriendInput.tsx
import { useState } from 'react';

interface FriendInputProps {
  friendAddress: string;
  setFriendAddress: (address: string) => void;
  setIsFriend: (isFriend: boolean) => void;
  isFriend: boolean | null;
  initializeChatroom: () => void;
}

export default function FriendInput({
  friendAddress,
  setFriendAddress,
  setIsFriend,
  isFriend,
  initializeChatroom,
}: FriendInputProps) {
  const [loading, setLoading] = useState(false);

  // Simulate checking if the friend has added you
  const checkFriendStatus = async () => {
    setLoading(true);
    const friendAddedYou = await checkIfFriendAddedYou(friendAddress);
    setIsFriend(friendAddedYou);
    setLoading(false);
  };

const checkIfFriendAddedYou = async (address: string) => {
    return true; // Simulate a friend always being added
};

  return (
    <div>
      <input
        type="text"
        placeholder="Enter friend's address"
        value={friendAddress}
        onChange={(e) => setFriendAddress(e.target.value)}
        className="border rounded p-2 w-80 mb-4"
      />
      <br />
      <button
        onClick={checkFriendStatus}
        className="bg-blue-500 text-white font-semibold py-2 px-6 rounded shadow-md hover:bg-blue-600 transition-colors"
      >
        {loading ? 'Checking...' : 'Check Friend Status'}
      </button>

      {/* Display result */}
      {isFriend === false && (
        <p className="text-red-500 mt-4">
          You have not been added as {friendAddress}'s friend yet.
        </p>
      )}

      {isFriend && (
        <div className="mt-4">
          <p className="text-green-500">You are friends with {friendAddress}!</p>
          <button
            onClick={initializeChatroom}
            className="bg-green-500 text-white font-semibold py-2 px-6 rounded shadow-md hover:bg-green-600 transition-colors mt-4"
          >
            Initialize Chatroom
          </button>
        </div>
      )}
    </div>
  );
}
