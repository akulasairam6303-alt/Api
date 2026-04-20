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
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};

    if (!data.number || data.number.length < 16) {
      newErrors.number = "Enter valid 16-digit card number";
    }

    if (!data.name || data.name.trim().length < 3) {
      newErrors.name = "Enter valid card holder name";
    }

    if (!data.expiry || !/^\d{2}\/\d{2}$/.test(data.expiry)) {
      newErrors.expiry = "Enter valid expiry (MM/YY)";
    }

    if (!data.cvv || data.cvv.length < 3) {
      newErrors.cvv = "Enter valid CVV";
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
            onChange={handleChange}
          />
          {errors.expiry && <p className="error">{errors.expiry}</p>}
        </div>

        <div className="field">
          <input
            type="password"
            name="cvv"
            placeholder="CVV"
            value={data.cvv}
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