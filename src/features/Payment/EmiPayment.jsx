import { useState } from "react";
import "../Payment/EmiPayment.css";

const emiData = {
  HDFC: { 3: 9, 6: 11, 9: 13, 12: 14 },
  ICICI: { 3: 10, 6: 12, 9: 14, 12: 15 },
  SBI: { 3: 11, 6: 13, 9: 15, 12: 16 },
  Axis: { 3: 10, 6: 12, 9: 14, 12: 15 },
  Kotak: { 3: 11, 6: 13, 9: 15, 12: 17 },
};

function EmiPayment({ amount, onSuccess, loading }) {
  const banks = Object.keys(emiData);
  const plans = [3, 6, 9, 12];

  const [bank, setBank] = useState("HDFC");
  const [months, setMonths] = useState(3);

  const getInterest = () => emiData[bank][months];

  const calcTotal = () =>
    Math.round(amount + (amount * getInterest()) / 100);

  const calcMonthly = () =>
    Math.round(calcTotal() / months);

  return (
    <div className="emi-box">
      <h3>EMI Payment</h3>

      <div className="form-group">
        <label>Select Bank</label>
        <select
          value={bank}
          onChange={(e) => {
            setBank(e.target.value);
            setMonths(3);
          }}
        >
          {banks.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Select Duration</label>
        <select
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
        >
          {plans.map((m) => (
            <option key={m} value={m}>
              {m} Months
            </option>
          ))}
        </select>
      </div>

      <div className="emi-summary">
        <p><strong>Bank:</strong> {bank}</p>
        <p><strong>Duration:</strong> {months} months</p>
        <p><strong>Interest:</strong> {getInterest()}%</p>
        <p><strong>Monthly:</strong> ₹{calcMonthly()}</p>
        <p><strong>Total:</strong> ₹{calcTotal()}</p>
      </div>

      <button
        className="emi-btn"
        onClick={() =>
          onSuccess({
            bank,
            months,
            interest: getInterest(),
            monthly: calcMonthly(),
            total: calcTotal(),
          })
        }
        disabled={loading}
      >
        {loading ? "Processing..." : "Continue"}
      </button>
    </div>
  );
}

export default EmiPayment;