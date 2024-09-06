import type { AppProps } from 'next/app';
import { WalletProvider } from '../contexts/WalletContext';
import '../app/globals.css';  // Import global styles if you have them

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  );
}

export default MyApp;
