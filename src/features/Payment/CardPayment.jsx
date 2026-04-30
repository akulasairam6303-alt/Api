import { useState } from "react";
import "../Payment/CardPayment.css";

function CardPayment({ onSuccess, loading }) {
  const [data, setData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "number") {
      value = value.replace(/\D/g, "").slice(0, 16);
    }

    if (name === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 3);
    }

    setData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length >= 3) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }

    setData(prev => ({ ...prev, expiry: value }));
    setErrors(prev => ({ ...prev, expiry: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (data.number.length !== 16) {
      newErrors.number = "Enter valid 16-digit card number";
    }

    if (!data.name || data.name.trim().length < 3) {
      newErrors.name = "Enter valid card holder name";
    }

    if (!/^\d{2}\/\d{2}$/.test(data.expiry)) {
      newErrors.expiry = "Enter valid expiry (MM/YY)";
    } else {
      const [month, year] = data.expiry.split("/").map(Number);

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      if (month < 1 || month > 12) {
        newErrors.expiry = "Invalid month";
      } else if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        newErrors.expiry = "Card has expired";
      }
    }

    if (!/^\d{3}$/.test(data.cvv)) {
      newErrors.cvv = "CVV must be exactly 3 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSuccess();
  };

  return (
    <div className="card-box">
      <h3>Credit / Debit Cards</h3>

      <p className="note">
        Please ensure your card can be used for online transactions.
      </p>

      <input
        type="text"
        name="number"
        placeholder="Card Number"
        value={data.number}
        onChange={handleChange}
      />
      {errors.number && <p className="error">{errors.number}</p>}

      <input
        type="text"
        name="name"
        placeholder="Name on Card"
        value={data.name}
        onChange={handleChange}
      />
      {errors.name && <p className="error">{errors.name}</p>}

      <div className="row">
        <div className="field">
          <input
            type="text"
            name="expiry"
            placeholder="MM/YY"
            value={data.expiry}
            maxLength={5}
            onChange={handleExpiryChange}
          />
          {errors.expiry && <p className="error">{errors.expiry}</p>}
        </div>

        <div className="field">
          <input
            type="password"
            name="cvv"
            placeholder="CVV"
            value={data.cvv}
            maxLength={3}
            onChange={handleChange}
          />
          {errors.cvv && <p className="error">{errors.cvv}</p>}
        </div>
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}

export default CardPayment;