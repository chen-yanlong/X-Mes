import { SignProtocolClient, SpMode, EvmChains } from "@ethsign/sp-sdk";
import ChatroomArtifact from '../abi/ChatRoom.json';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import crypto from 'crypto';

/**
 * Sends a friend request by signing an attestation.
 * @param friendAddress The address of the friend to whom the request is being sent.
 * @param chain The chain of the friend
 */
export async function sendFriendRequest(
    userAddress: string, 
    userChain: string, 
    friendAddress: string, 
    friendChain: string
) {
    //TODO: change this if added more chain
    const signOnChain = (userChain === "sepolia") ? EvmChains.sepolia : EvmChains.arbitrumSepolia;
    const schemaId = (userChain === "sepolia") ? "0x157" : "0xd7";

    try {
        // deploy oapp smart contract
        const oappAddress = await deployOAPP(userAddress, userChain);
        
        // generate ECDH key
        const { ECDH, userKeyBase64 } = generateKey();
        
        // attest to sign protocol
        const signRes = await attestToSignProtocol(
            signOnChain, schemaId, friendAddress, friendChain, userAddress, oappAddress, userKeyBase64
        );
        const attestationId = signRes.attestationId;
        const txHash = signRes.txHash;
        const indexingValue = signRes.indexingValue;

        return { oappAddress, ECDH, attestationId, txHash, indexingValue };

    } catch (error) {
        console.error('Error sending friend request:', error);
        throw error;
    }
}

async function deployOAPP(delegate: string, chain: string) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();
    
    // Set the LayerZero endpoint and delegate address
    //TODO: add more chain
    const endpoint = (chain === "sepolia")   
        ? "0x6EDCE65403992e310A62460808c4b910D972f10f"
        : "0x6EDCE65403992e310A62460808c4b910D972f10f";
    

    const factory = new ethers.ContractFactory(ChatroomArtifact.abi, ChatroomArtifact.bytecode, signer);
    
    const chatroomContract = await factory.deploy(endpoint, delegate);

    await chatroomContract.waitForDeployment();

    const contractAddress = await chatroomContract.getAddress();

    console.log('Chatroom contract deployed to:', contractAddress);
    return contractAddress;
}

function generateKey() {
    const ECDH = crypto.createECDH('prime192v1');
    const userKey = ECDH.generateKeys();
    const userKeyBase64 = userKey.toString('base64');

    return{ ECDH, userKeyBase64 };
}

async function attestToSignProtocol(
    signOnChain: any, 
    schemaId: any, 
    friendAddress: string, 
    friendChain: string, 
    userAddress: string,
    oappAddress: string,
    userKeyBase64: string
) {
    // attest to sign protocol
    const client = new SignProtocolClient(SpMode.OnChain, {
        chain: signOnChain,
    });
    console.log(schemaId)
    const res = await client.createAttestation({
        schemaId: schemaId,
        data: {
            friendAddress,
            chain: friendChain,
            key: userKeyBase64,
            oappAddress,
        },
        indexingValue: userAddress.toLowerCase()
    });
    console.log(res)
    return(res)
}