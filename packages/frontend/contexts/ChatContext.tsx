import { createContext, useState, useContext, ReactNode } from 'react';
import crypto from 'crypto'; // Import crypto for ECDH types

interface ChatContextType {
  key: string | null;
  userOappAddress: string;
  ECDH: crypto.ECDH | null;
  setKey: (key: string) => void;
  setUserOappAddress: (address: string) => void;
  setECDH: (ECDH: crypto.ECDH) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [key, setKey] = useState<string>("");
  const [userOappAddress, setUserOappAddress] = useState<string>("");
  const [ECDH, setECDH] = useState<crypto.ECDH | null>(null); // Initially null, set when needed

  return (
    <ChatContext.Provider value={{ key, userOappAddress, ECDH, setKey, setUserOappAddress, setECDH }}>
      {children}
    </ChatContext.Provider>
  );
};
