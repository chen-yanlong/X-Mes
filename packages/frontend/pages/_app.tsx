import type { AppProps } from 'next/app';
import { WalletProvider } from '../contexts/WalletContext';
import { ChatProvider } from '../contexts/ChatContext';  // Import the ChatProvider
import '../app/globals.css';  // Import global styles if you have them

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <ChatProvider> 
        <Component {...pageProps} />
      </ChatProvider>
    </WalletProvider>
  );
}

export default MyApp;
