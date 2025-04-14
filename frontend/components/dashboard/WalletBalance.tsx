const WalletBalance = ({ balance }: { balance: number }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold">💰 Wallet Balance</h3>
    <p className="text-2xl text-green-600">${balance}</p>
  </div>
);

export default WalletBalance;
