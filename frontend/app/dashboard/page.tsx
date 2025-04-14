'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FieldConfig, useDynamicForm } from '@/hooks/useDynamicForm';
import DashboardCard from '@/components/dashboard/DashboardCard';
import UserHeader from '@/components/dashboard/UserHeader';
import UserDetails from '@/components/dashboard/UserDetails';
import WalletBalance from '@/components/dashboard/WalletBalance';

// Define the shape of the form state
type DashboardFormFields = {
  user: {
    name: string;
    email: string;
    uuid: string;
    balance: number;
    profilePic?: string;
    transactions?: { date: string; amount: number }[];
  } | null;
  loading: boolean;
  error: string | null;
};

const DashboardPage = () => {
  const router = useRouter();

  const fieldConfig: FieldConfig<DashboardFormFields>[] = [
    { name: 'user', initialValue: null },
    { name: 'loading', initialValue: true },
    { name: 'error', initialValue: null },
  ];

  const { formState, setField } = useDynamicForm<DashboardFormFields>(fieldConfig);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return router.push('/auth/login');

      try {
        const res = await fetch('/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });


        if (!res.ok) throw new Error('Failed to fetch user');

        const data = await res.json();
        setField('user', data);
      } catch (err) {
        // setField('error', 'Failed to fetch user data');
        setField('error', err.error);
        alert(`${err.error}\nThe auth token is about to be cleared!`);
        localStorage.removeItem('authToken');
      } finally {
        setField('loading', false);
      }
    };

    fetchUser();
  }, [router, setField]);

  if (formState.loading) return <div className="text-center mt-10">Loading...</div>;
  if (formState.error) return <div className="text-center text-red-500 mt-10">{formState.error}</div>;
  if (!formState.user) return null;

  const { user } = formState;

  return (
     <DashboardCard>
      <UserHeader name={user.name} email={user.email} profilePic={user.profilePic} />
      <UserDetails uuid={user.uuid} email={user.email} />
      <WalletBalance balance={user.balance} />

      <div className="mb-6">
        <h3 className="text-lg font-semibold">📜 Recent Transactions</h3>
        {user.transactions?.length ? (
          <ul className="text-sm text-gray-700 space-y-1">
            {user.transactions.map((tx, i) => (
              <li key={i} className="flex justify-between">
                <span>{tx.date}</span>
                <span className={tx.amount >= 0 ? 'text-green-600' : 'text-red-500'}>
                  {tx.amount >= 0 ? `+${tx.amount}` : tx.amount}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No transactions found.</p>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => router.push('/dashboard/edit-profile')}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Edit Profile
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('authToken');
            router.push('/auth/login');
          }}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Log Out
        </button>
      </div>
    </DashboardCard>
  );
};

export default DashboardPage;
