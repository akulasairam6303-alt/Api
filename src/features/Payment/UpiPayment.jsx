import { useState } from "react";
import "../Payment/UpiPayment.css";

function UPIPayment({ amount, onSuccess }) {
  const [upiId, setUpiId] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateUPI = (upi) => {
    const regex = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/;
    return regex.test(upi);
  };

  const handleAppSelect = (app) => {
    setSelectedApp(app);

    if (app === "gpay") setUpiId("user@okaxis");
    if (app === "phonepe") setUpiId("user@ybl");
    if (app === "paytm") setUpiId("user@paytm");
    if (app === "bhim") setUpiId("user@upi");

    setError("");
  };

  const handlePay = () => {
    setError("");

    if (!upiId) {
      setError("Enter UPI ID");
      return;
    }

    if (!validateUPI(upiId)) {
      setError("Invalid UPI ID");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const fakeResponse = {
        razorpay_payment_id: "pay_" + Date.now(),
        method: "upi",
        amount,
        status: "success",
      };

      setLoading(false);
      onSuccess(fakeResponse);
    }, 1200);
  };

  return (
    <div className="upi-container">
      <h3>UPI (Pay Via Any App)</h3>

      <p className="sub-text">Pay with any UPI App</p>

      <div className="upi-apps">

        <div 
          className={`upi-app ${selectedApp === "gpay" ? "active" : ""}`}
          onClick={() => handleAppSelect("gpay")}
        >
          <img src="/images/gpay.png" alt="gpay" />
        </div>

        <div 
          className={`upi-app ${selectedApp === "phonepe" ? "active" : ""}`}
          onClick={() => handleAppSelect("phonepe")}
        >
          <img src="/images/phonepe.png" alt="phonepe" />
        </div>

        <div 
          className={`upi-app ${selectedApp === "paytm" ? "active" : ""}`}
          onClick={() => handleAppSelect("paytm")}
        >
          <img src="/images/paytm.png" alt="paytm" />
        </div>

        <div 
          className={`upi-app ${selectedApp === "bhim" ? "active" : ""}`}
          onClick={() => handleAppSelect("bhim")}
        >
          <img src="/images/bhim.png" alt="bhim" />
        </div>

      </div>

      <div className="divider">---- or ----</div>

      <p className="sub-text">Pay with UPI ID</p>

      <div className="upi-input-row">
        <input
          type="text"
          placeholder="example@okicici"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
        />
        <button
          className="verify-btn"
          onClick={() => {
            if (!validateUPI(upiId)) {
              setError("Invalid UPI ID");
            } else {
              setError("UPI ID looks good");
            }
          }}
        >
          verify
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <button className="pay-btn" onClick={handlePay} disabled={loading}>
        {loading ? "Processing..." : `Pay ₹${amount}`}
      </button>
    </div>
  );
}

export default UPIPayment;