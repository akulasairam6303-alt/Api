import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCartArray, selectCartTotalPrice } from "../cart/cartSelectors";
import { clearCart } from "../cart/cartSlice";
import { useNavigate } from "react-router-dom";
import StepHeader from "../StepHeader/StepHeader";
import UPIPayment from "./UPIPayment";
import "./payment.css";

function PaymentPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartArray);
  const totalPrice = useSelector(selectCartTotalPrice);

  const { addresses, selectedAddressId } = useSelector(
    (state) => state.address
  );

  const selected = addresses.find((a) => a.id === selectedAddressId);

  const [selectedMethod, setSelectedMethod] = useState("cod");

  const discount = Math.round(totalPrice * 0.5);
  const platformFee = totalPrice > 500 ? 0 : 40;
  const codFee = selectedMethod === "cod" && totalPrice <= 500 ? 10 : 0;

  const finalTotal = totalPrice - discount + platformFee + codFee;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  const handleCOD = () => {
    if (cartItems.length === 0 || !selected) return;

    const newOrder = {
      id: Date.now(),
      items: cartItems,
      address: selected,
      total: finalTotal,
      payment: "cod",
      date: new Date().toISOString(),
    };

    const existingOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    existingOrders.push(newOrder);

    localStorage.setItem("orders", JSON.stringify(existingOrders));
    localStorage.setItem("currentOrder", JSON.stringify(newOrder));

    dispatch(clearCart());
    navigate("/order-confirm");
  };

  const handleUPISuccess = (response) => {
    if (cartItems.length === 0 || !selected) return;

    const newOrder = {
      id: Date.now(),
      items: cartItems,
      address: selected,
      total: finalTotal,
      payment: "upi",
      razorpay_payment_id: response.razorpay_payment_id,
      date: new Date().toISOString(),
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

          <div className="method disabled">Credit / Debit Cards</div>
          <div className="method disabled">EMI</div>
        </div>

        <div className="middle">

          {selectedMethod === "cod" && (
            <>
              <h3>Cash On Delivery</h3>

              <p className="note">
                A fee of ₹10 is applicable for this option.
              </p>

              <button className="continue" onClick={handleCOD}>
                Place Order
              </button>
            </>
          )}

          {selectedMethod === "upi" && (
            <UPIPayment
              amount={finalTotal}
              onSuccess={handleUPISuccess}
            />
          )}

        </div>

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

          {selectedMethod === "cod" && (
            <div className="price-row">
              <span>COD Fee</span>
              <span>₹{codFee}</span>
            </div>
          )}

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