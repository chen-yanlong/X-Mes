// pages/index.tsx
import { useRouter } from 'next/router';
import '../app/globals.css';

export default function Home() {
  const router = useRouter();

  const navigateToApp = () => {
    router.push('/connect-wallet');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Welcome to <span className="text-blue-600">Xmes</span>
        </h1>
      </div>
      <button
        onClick={navigateToApp}
        className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300"
      >
        Go to App
      </button>
    </div>
  );
}
