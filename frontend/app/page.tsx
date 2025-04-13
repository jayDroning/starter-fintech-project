'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Hero from '../components/Hero';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated, and redirect accordingly
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      setLoading(false); // Stop loading if not authenticated
    }
  }, [isAuthenticated, router]);

  if (loading) {
    // Display a loading spinner or a message while the page redirects
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-semibold">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <Hero />
    </main>
  );
};

export default HomePage;