import { useEffect, useState } from "react";
import api from "../../../api/axios";
import "./Transactions.css";

export default function Transactions() {

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {

        const res = await api.get("/transactions");

        setTransactions(res.data || []);

      } catch (err) {

        console.error("Transaction fetch error:", err);

      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

  }, []);

  if (loading) {
    return (
      <div className="transactions-page">
        Loading transactions...
      </div>
    );
  }

  return (

    <div className="transactions-page">

      <div className="transactions-header">
        <h2>Transaction History</h2>
      </div>

      <div className="transactions-table">

        <div className="table-head">
          <span>Type</span>
          <span>Asset</span>
          <span>Amount</span>
          <span>Price</span>
          <span>Status</span>
          <span>Date</span>
        </div>

        {transactions.length === 0 && (
          <div className="empty-row">
            No transactions yet
          </div>
        )}

        {transactions.map((tx) => (

          <div key={tx._id} className="table-row">

            <span className={`tx-type ${tx.type}`}>
              {tx.type}
            </span>

            <span>{tx.asset}</span>

            <span>
              {tx.amount}
            </span>

            <span>
              ${tx.price?.toLocaleString()}
            </span>

            <span className={`status ${tx.status}`}>
              {tx.status}
            </span>

            <span>
              {new Date(tx.createdAt).toLocaleDateString()}
            </span>

          </div>

        ))}

      </div>

    </div>

  );

}