"use client"

import axios from 'axios'; // For making API requests
import { FieldConfig, useDynamicForm } from '@/hooks/useDynamicForm';

// Define the shape of the form state
type DashboardFormFields = {
  // user: {
  //   name: string;
  //   email: string;
  //   uuid: string;
  //   balance: number;
  //   profilePic?: string;
  //   transactions?: { date: string; amount: number }[];
  // } | null;

  recipientAddress: string;
  amount: string;
  transactionType: string;
  transactionFee: number;
  loading: boolean;
  error: string | null;
  confirmation: boolean;
};

const SendPage = () => {
  
  const fieldConfig: FieldConfig<DashboardFormFields>[] = [
    // { name: 'user', initialValue: null },
    { name: 'recipientAddress', initialValue: '' },
    { name: 'amount', initialValue: '' },
    { name: 'transactionType', initialValue: 'crypto' }, // Default: crypto
    { name: 'transactionFee', initialValue: 0 },
    { name: 'loading', initialValue: true },
    { name: 'error', initialValue: null },
    { name: 'confirmation', initialValue: false }
  ];

  const { formState, setField } = useDynamicForm<DashboardFormFields>(fieldConfig);

  // Dummy function to calculate transaction fees (could be dynamic depending on type)
  const calculateFee = (amount: number) => {
    // For simplicity, assume 0.5% fee
    return amount * 0.005;
  };

  // Handle form submission
  const handleSendTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setField('loading', true);
    setField('error', '');
    setField('confirmation', false);

    try {
      // Calculate the transaction fee dynamically
      const fee = calculateFee(Number(formState.amount));
      setField('transactionFee', fee);

      // Simulating a transaction API request
      const response = await axios.post('/api/transactions', {
        recipientAddress: formState.recipientAddress,
        amount: formState.amount,
        transactionType: formState.transactionType,
        transactionFee: formState.transactionFee,
      });

      // If successful, set confirmation
      setField('confirmation', true);
      setField('loading', false);
      alert('Transaction Successful!');
    } catch (error) {
      setField('loading', false);
      setField('error', 'Transaction failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">💸 Send Transaction</h2>

        {formState.error && (
          <div className="bg-red-500 text-white p-2 rounded mb-4 text-center">
            {formState.error}
          </div>
        )}

        {formState.confirmation && (
          <div className="bg-green-500 text-white p-2 rounded mb-4 text-center">
            Transaction Successful! 🎉
          </div>
        )}

        <form onSubmit={handleSendTransaction}>
          <div className="mb-4">
            <label htmlFor="recipientAddress" className="block text-sm font-medium text-gray-700">
              Recipient Address
            </label>
            <input
              type="text"
              id="recipientAddress"
              value={formState.recipientAddress}
              onChange={(e) => setField('recipientAddress', e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={formState.amount}
              onChange={(e) => setField('amount', e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="transactionType" className="block text-sm font-medium text-gray-700">
              Transaction Type
            </label>
            <select
              id="transactionType"
              value={formState.transactionType}
              onChange={(e) => setField('transactionType', e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="crypto">Cryptocurrency</option>
              <option value="fiat">Fiat</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Transaction Fee</label>
            <div className="p-3 mt-1 border border-gray-300 rounded">
              {formState.transactionFee ? `${formState.transactionFee.toFixed(2)} USD` : 'Calculating...'}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-semibold"
            disabled={formState.loading}
          >
            {formState.loading ? 'Processing...' : 'Send Transaction'}
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          <a href="/dashboard" className="text-blue-600 hover:underline">
            Back to Dashboard
          </a>
        </p>
      </div>
    </div>
  );
}

export default SendPage;