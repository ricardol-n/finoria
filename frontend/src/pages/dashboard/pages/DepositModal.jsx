import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import api from "../../../api/axios";
import "./DepositModal.css";

export default function DepositModal({ onClose }) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("btc");
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleCreatePayment = async () => {
    try {
      const res = await api.post("/api/crypto/create", {
        amount,
        currency,
      });

      setPaymentData(res.data);
    } catch (err) {
      alert("Payment failed");
    }
  };

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="deposit-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {!paymentData ? (
          <>
            <h2>Crypto Deposit</h2>

            <input
              type="number"
              placeholder="Enter amount (USD)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="btc">Bitcoin (BTC)</option>
              <option value="eth">Ethereum (ETH)</option>
              <option value="usdttrc20">USDT (TRC20)</option>
            </select>

            <button onClick={handleCreatePayment}>
              Generate Payment
            </button>

            <button className="cancel" onClick={onClose}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <h2>Send Crypto</h2>

            <p className="muted">
              Send the exact amount to this address:
            </p>

            <div className="address-box">
              {paymentData.pay_address}
            </div>

            <p className="status">Status: Pending</p>

            <button onClick={onClose}>Close</button>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(
    modalContent,
    document.getElementById("modal-root")
  );
}