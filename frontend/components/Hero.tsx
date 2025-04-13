import Link from 'next/link';
import Image from 'next/image';

import VisaSVG from './visa-logo.svg';

const Hero: React.FC = () => {
  return (
    <section className="text-center max-w-2xl mx-auto px-6 py-12 bg-white rounded-xl shadow-lg border border-blue-100">     

      <h1 className="flex justify-center items-center text-4xl font-extrabold mb-4 text-blue-700 tracking-tight">
        {"Welcome to "} 
        <div className="w-32 text-[#1A1F71]"> {/* Visa blue */}
          <VisaSVG style={{ color: '#1a1aff' }}  />
        </div>
        {"Vault 💳"}
      </h1>
      <p className="mb-6 text-gray-600 text-lg">
        Experience the next-gen way to manage your finances — secure, fast, and beautifully simple.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          href="/auth/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-200"
        >
          Log In
        </Link>
        <Link
          href="/auth/register"
          className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-blue-50 transition duration-200"
        >
          Get Started
        </Link>
      </div>

      <div className="mt-8 text-sm text-gray-400 italic">
        A fan project inspired by Visa – for educational and creative exploration.
      </div>
    </section>
  );
};

export default Hero;