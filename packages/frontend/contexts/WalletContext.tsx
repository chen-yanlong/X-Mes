import { createContext, useState, useContext, ReactNode } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

interface WalletContextType {
  account: string;
  network: string;
  connectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string>("");
  const [network, setNetwork] = useState<string>("");

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const network = await provider.getNetwork();

      setAccount(userAddress);
      setNetwork(network.name);
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  return (
    <WalletContext.Provider value={{ account, network, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
