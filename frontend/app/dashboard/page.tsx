'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch user data from the API
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        // If no token, redirect to login
        router.push('/auth/login');
        return;
      }

      try {
        const response = await fetch('/api/user', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        setError('An error occurred while fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Welcome to Your Dashboard</h2>

        {/* User Info Section */}
        {user && (
          <div className="flex items-center mb-6">
            <img
              src={user.profilePic || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
        )}

        {/* User Info Details */}
        {user && (
          <div className="mb-6">
            <p className="text-lg">Email: {user.email}</p>
            <p className="text-lg">User ID: {user.uuid}</p>
          </div>
        )}
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Wallet Balance</h3>
          <p className="text-2xl text-green-600">${user.balance}</p>
        </div>

         {/* Recent Transactions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          {user.transactions && user.transactions.length > 0 ? (
            <ul>
              {user.transactions.map((tx, index) => (
                <li key={index} className="flex justify-between">
                  <span>{tx.date}</span>
                  <span>{tx.amount > 0 ? `+${tx.amount}` : tx.amount}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No transactions found</p>
          )}
        </div>

        <div className='flex justify-between'>
          {/* Edit Profile Button */}
          <button
            onClick={() => router.push('/dashboard/edit-profile')}
            className="bg-blue-600 text-white p-2 rounded"
          >
            Edit Profile
          </button>

          {/* Log Out Button */}
          <button
            onClick={() => {
              localStorage.removeItem('authToken');
              router.push('/auth/login');
            }}
            className="bg-red-600 text-white p-2 rounded"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}