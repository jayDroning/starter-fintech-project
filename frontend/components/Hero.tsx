// components/Hero.tsx
import Link from 'next/link';

const Hero: React.FC = () => {
  return (
    <div className="text-center max-w-xl p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-4">Welcome to SimpleWallet 💸</h1>
      <p className="mb-6 text-gray-600">
        A lightweight way to send, receive, and track your digital money.
      </p>
      <div className="space-x-4">
        <Link href="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Log In
        </Link>
        <Link href="/auth/register" className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Hero;