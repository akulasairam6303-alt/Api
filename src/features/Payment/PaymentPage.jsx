import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCartArray, selectCartTotalPrice } from "../cart/cartSelectors";
import { clearCart } from "../cart/cartSlice";
import { useNavigate } from "react-router-dom";
import StepHeader from "../StepHeader/StepHeader";
import "./payment.css";

function PaymentPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartArray);
  const totalPrice = useSelector(selectCartTotalPrice);

  const { addresses, selectedAddressId } = useSelector(
    state => state.address
  );

  const selected = addresses.find(a => a.id === selectedAddressId);

  const [selectedMethod, setSelectedMethod] = useState("cod");

  const discount = Math.round(totalPrice * 0.5);
  const platformFee = totalPrice > 500 ? 0 : 20;
  const finalTotal = totalPrice - discount + platformFee;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  const handleContinue = () => {
    if (cartItems.length === 0 || !selected) return;

    const newOrder = {
      id: Date.now(),
      items: cartItems,
      address: selected,
      total: finalTotal,
      payment: selectedMethod,
      date: new Date().toISOString()
    };

    const existingOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    existingOrders.push(newOrder);

    localStorage.setItem("orders", JSON.stringify(existingOrders));
    localStorage.setItem("currentOrder", JSON.stringify(newOrder));

    dispatch(clearCart());

    navigate("/order-confirm");
  };

  return (
    <div className="cart-container">

      <StepHeader currentStep={3} />

      <div className="payment-box">

        {/* LEFT */}
        <div className="left">
          <h3>Choose Payment Mode</h3>

          <div
            className={`method ${selectedMethod === "cod" ? "active" : ""}`}
            onClick={() => setSelectedMethod("cod")}
          >
            Cash On Delivery
          </div>

          <div
            className={`method ${selectedMethod === "upi" ? "active" : ""}`}
            onClick={() => setSelectedMethod("upi")}
          >
            UPI (Pay Via Any App)
          </div>

          <div
            className={`method ${selectedMethod === "card" ? "active" : ""}`}
            onClick={() => setSelectedMethod("card")}
          >
            Credit / Debit Cards
          </div>

          <div
            className={`method ${selectedMethod === "emi" ? "active" : ""}`}
            onClick={() => setSelectedMethod("emi")}
          >
            EMI
          </div>
        </div>

        {/* MIDDLE */}
        <div className="middle">

          <h3>{selectedMethod.toUpperCase()}</h3>

          <label className="radio">
            <input
              type="radio"
              checked={selectedMethod === "cod"}
              onChange={() => setSelectedMethod("cod")}
            />
            Cash On Delivery
          </label>

          <p className="note">
            A fee of ₹10 is applicable for this option. Online payment will help you avoid this fee.
          </p>

          <button
            className="continue"
            onClick={handleContinue}
            disabled={cartItems.length === 0}
          >
            Continue
          </button>

        </div>

        {/* RIGHT (SUMMARY BACK ADDED) */}
        <div className="summary-section">

          <h4>ESTIMATED DELIVERY TIME</h4>
          <p className="date">{deliveryDate.toDateString()}</p>

          <div className="price-row">
            <span>Price</span>
            <span>₹{totalPrice}</span>
          </div>

          <div className="price-row green">
            <span>Discount</span>
            <span>-₹{discount}</span>
          </div>

          <div className="price-row">
            <span>Platform Fee</span>
            <span>₹{platformFee}</span>
          </div>

          <hr />

          <div className="total">
            <span>Total Amount</span>
            <span>₹{finalTotal}</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default PaymentPage;