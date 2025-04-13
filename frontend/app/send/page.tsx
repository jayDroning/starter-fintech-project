"use client"
import { useState } from 'react';
import axios from 'axios'; // For making API requests

export default function SendPage() {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('crypto'); // Default: crypto
  const [transactionFee, setTransactionFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(false);

  // Dummy function to calculate transaction fees (could be dynamic depending on type)
  const calculateFee = (amount: number) => {
    // For simplicity, assume 0.5% fee
    return amount * 0.005;
  };

  // Handle form submission
  const handleSendTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setConfirmation(false);

    try {
      // Calculate the transaction fee dynamically
      const fee = calculateFee(Number(amount));
      setTransactionFee(fee);

      // Simulating a transaction API request
      const response = await axios.post('/api/transactions', {
        recipientAddress,
        amount,
        transactionType,
        transactionFee: fee,
      });

      // If successful, set confirmation
      setConfirmation(true);
      setLoading(false);
      alert('Transaction Successful!');
    } catch (error) {
      setLoading(false);
      setError('Transaction failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">💸 Send Transaction</h2>

        {error && (
          <div className="bg-red-500 text-white p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {confirmation && (
          <div className="bg-green-500 text-white p-2 rounded mb-4 text-center">
            Transaction Successful! 🎉
          </div>
        )}

        {/* Send Transaction Form */}
        <form onSubmit={handleSendTransaction}>
          <div className="mb-4">
            <label htmlFor="recipientAddress" className="block text-sm font-medium text-gray-700">
              Recipient Address
            </label>
            <input
              type="text"
              id="recipientAddress"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
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
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="crypto">Cryptocurrency</option>
              <option value="fiat">Fiat</option>
              {/* Add more options if needed */}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Transaction Fee</label>
            <div className="p-3 mt-1 border border-gray-300 rounded">
              {transactionFee ? `${transactionFee.toFixed(2)} USD` : 'Calculating...'}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-semibold"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Send Transaction'}
          </button>
        </form>

        {/* Confirmation Message */}
        <p className="text-sm text-center mt-6">
          <a href="/dashboard" className="text-blue-600 hover:underline">
            Back to Dashboard
          </a>
        </p>
      </div>
    </div>
  );
}
