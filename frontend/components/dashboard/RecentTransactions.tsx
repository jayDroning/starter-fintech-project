
type Props = {
    user: {
        name: string;
        email: string;
        uuid: string;
        balance: number;
        profilePic?: string;
        transactions?: { date: string; amount: number }[];
    }
}

const RecentTransactions = ({user}: Props) => (

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
)

export default RecentTransactions;