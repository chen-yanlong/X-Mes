// components/Banner.tsx
import Link from 'next/link';

const Banner = () => {
  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <ul className="flex justify-center space-x-6">
        <li>
          <Link
            href="/connect-wallet"
            className="text-white text-lg font-semibold hover:text-blue-300 transition-colors"
          >
            Connect Wallet
          </Link>
        </li>
        <li>
          <Link
            href="/friend-request"
            className="text-white text-lg font-semibold hover:text-blue-300 transition-colors"
          >
            Send Friend Request
          </Link>
        </li>
        <li>
          <Link
            href="/chatroom"
            className="text-white text-lg font-semibold hover:text-blue-300 transition-colors"
          >
            Chatroom
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Banner;
