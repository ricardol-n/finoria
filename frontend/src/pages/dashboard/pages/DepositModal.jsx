import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import api from "../../../api/axios";
import "./DepositModal.css";


const minAmountCache = {};
 
export default function DepositModal({
  onClose,
  assetName,
  onDepositSuccess, // ✅ now properly received
}) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(
    assetName?.toLowerCase() || "btc"
  );
  const [paymentData, setPaymentData] = useState(null);
  const [minAmount, setMinAmount] = useState(null);
  const [status, setStatus] = useState("pending");

  const intervalRef = useRef(null); // ✅ store interval safely
  const fetchingRef = useRef(false);

  /* =============================
     FETCH MINIMUM DEPOSIT
  ============================= */
  useEffect(() => {

    const fetchMin = async () => {

      if (!currency) return;

      /* USE CACHE FIRST */
      if (minAmountCache[currency]) {
        setMinAmount(minAmountCache[currency]);
        return;
      }

      /* PREVENT MULTIPLE CALLS */
      if (fetchingRef.current) return;
      fetchingRef.current = true;

      try {
        const res = await api.get(
          `/crypto/min-amount?currency_to=${currency}`
        );

        const min = res.data?.min_amount || 0;

        minAmountCache[currency] = min;
        setMinAmount(min);

      } catch (err) {
        console.error("Failed to fetch min amount:", err);
      } finally {
        fetchingRef.current = false;
      }
    };

    fetchMin();

  }, [currency]);


  /* =============================
     DISABLE BODY SCROLL
  ============================= */
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";

      // ✅ Clear polling if modal closes
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  /* =============================
     CREATE PAYMENT
  ============================= */
  const handleCreatePayment = async () => {
    
    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }

    if (minAmount && Number(amount) < Number(minAmount)) {
      alert(`Minimum deposit is $${minAmount}`);
      return;
    }

    try {
      const res = await api.post("/crypto/create", {
        amount,
        currency,
      });

      setPaymentData(res.data);
      setStatus("pending");

      pollPaymentStatus(res.data.payment_id);
    } catch (err) {
      console.error(err);
      alert("Payment creation failed");
    }
  };

  /* =============================
     POLL PAYMENT STATUS
  ============================= */
  const pollPaymentStatus = (paymentId) => {
    intervalRef.current = setInterval(async () => {
      try {
        const res = await api.get(
          `/crypto/status/${paymentId}`
        );

        if (res.data.status === "completed") {
          setStatus("completed");
          clearInterval(intervalRef.current);

          if (onDepositSuccess) {
            onDepositSuccess(); // ✅ notify parent
          }

          setTimeout(() => {
            onClose();
          }, 2000);
        }
      } catch (err) {
        console.error("Failed to fetch payment status", err);
      }
    }, 5000);
  };

  /* =============================
     MODAL UI
  ============================= */
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

            {minAmount && (
              <p className="min-text">
                Minimum deposit: ${minAmount}
              </p>
            )}

            <select
              value={currency}
              onChange={(e) =>
                setCurrency(e.target.value)
              }
            >
              <option value="btc">Bitcoin (BTC)</option>
              <option value="eth">Ethereum (ETH)</option>
              <option value="usdttrc20">
                USDT (TRC20)
              </option>
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

            <p className={`status ${status}`}>
              Status: {status}
            </p>

            {status === "completed" && (
              <p className="success-text">
                Deposit confirmed ✅
              </p>
            )}
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