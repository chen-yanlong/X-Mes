// components/FriendInput.tsx
import { useState } from 'react';
import { queryAttestations } from '../services/queryingService'
import { findAttestation } from '../services/parsingDataService'
import { useWallet } from '../contexts/WalletContext'

interface FriendInputProps {
    friendChain: string;
    friendAddress: string;
    setFriendChain: (chain: string) => void;
    setFriendAddress: (address: string) => void;
    setIsFriend: (isFriend: boolean) => void;
    isFriend: boolean | null;
    initializeChatroom: () => void;
    setFriendKey: (key: string) => void
    setFriendOappAddress:(friendOappAddress: string) => void
}

export default function FriendInput({
    friendChain,
    friendAddress,
    setFriendChain,
    setFriendAddress,
    setIsFriend,
    isFriend,
    initializeChatroom,
    setFriendKey,
    setFriendOappAddress,
}: FriendInputProps) {
    const [loading, setLoading] = useState(false);
    const { account, network } = useWallet();

    const checkFriendStatus = async () => {
        setLoading(true);
        const youAddedFriendData = await checkAttestation(network, account, friendChain, friendAddress);
        if(!youAddedFriendData){
            console.log("you havent added friend");
            setIsFriend(false)
            setLoading(false);
            return
        }
        const friendAddedYouData = await checkAttestation(friendChain, friendAddress, network, account);
        if(!friendAddedYouData){
            console.log("friend havent added you");
            setIsFriend(false);
            setLoading(false);
            return
        }
        setIsFriend(true);
        setFriendKey(friendAddedYouData.key)
        setFriendOappAddress(friendAddedYouData.oappAddress)

        setLoading(false);
    };


    const checkAttestation = async (chain: string, address: string, friendChain:string, friendAddress:string, ) => {
        const schemaId = (chain === 'sepolia') 
            ? "onchain_evm_11155111_0x157"
            : "onchain_evm_421614_0xd7"
        try{
            const res = await queryAttestations(schemaId, address)
            if (!res.success)
                return false;
            const foundData = findAttestation(friendAddress, friendChain ,res.attestations)
            console.log(foundData)
            return foundData
        } catch(e) {
            console.log(e)
        }
        return false
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
        <input
            type="text"
            placeholder="Enter friend's chain"
            value={friendChain}
            onChange={(e) => setFriendChain(e.target.value)}
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
