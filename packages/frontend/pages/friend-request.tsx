// pages/friend-request.tsx
import { useState } from 'react';
import Banner from '../components/Banner';

export default function FriendRequest() {
  const [friendAddress, setFriendAddress] = useState('');

  const sendFriendRequest = () => {
    // Logic to send the friend request via Sign Protocol
    console.log('Sending friend request to:', friendAddress);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Banner />
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Send Friend Request</h2>
        <input
          type="text"
          placeholder="Enter friend's address"
          value={friendAddress}
          onChange={(e) => setFriendAddress(e.target.value)}
          style={{ padding: '10px', width: '300px', marginBottom: '10px' }}
        />
        <br />
        <button onClick={sendFriendRequest} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Send Request
        </button>
      </div>
    </div>
  );
}
