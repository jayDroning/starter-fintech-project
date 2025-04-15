'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FieldConfig, useDynamicForm } from '@/hooks/useDynamicForm';
import DashboardCard from '@/components/dashboard/DashboardCard';
import UserHeader from '@/components/dashboard/UserHeader';
import UserDetails from '@/components/dashboard/UserDetails';
import WalletBalance from '@/components/dashboard/WalletBalance';
import ProfileActions from '@/components/dashboard/ProfileActions';
import RecentTransactions from '@/components/dashboard/RecentTransactions';

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
      <RecentTransactions 
        user={user}
      />
      <ProfileActions
        onEdit={() => router.push('/dashboard/edit-profile')}
        onLogout={() => {
          localStorage.removeItem('authToken');
          router.push('/auth/login');
        }}
      />

    </DashboardCard>
  );
};

export default DashboardPage;
