import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCartArray, selectCartTotalPrice } from "../cart/cartSelectors";
import { clearCart } from "../cart/cartSlice";
import { useNavigate } from "react-router-dom";
import StepHeader from "../StepHeader/StepHeader";
import UPIPayment from "./UPIPayment";
import CardPayment from "./CardPayment";
import EmiPayment from "./EmiPayment";
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
  const [loading, setLoading] = useState(false);

  const discount = Math.round(totalPrice * 0.5);
  const platformFee = totalPrice > 500 ? 0 : 40;
  const codFee = selectedMethod === "cod" && totalPrice <= 500 ? 10 : 0;

  const finalTotal = totalPrice - discount + platformFee + codFee;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  const processPayment = (method, extra = {}) => {
    if (cartItems.length === 0 || !selected) return;

    setLoading(true);

    setTimeout(() => {
      const newOrder = {
        id: Date.now(),
        items: cartItems,
        address: selected,
        total: Number(finalTotal.toFixed(2)),
        payment: method,
        transactionId:
          extra?.upiId ||
          "TXN" + Math.floor(Math.random() * 1000000),
        emiPlan: method === "emi" ? extra : null,
        date: new Date().toISOString(),
      };

      const existingOrders =
        JSON.parse(localStorage.getItem("orders")) || [];

      existingOrders.push(newOrder);

      localStorage.setItem("orders", JSON.stringify(existingOrders));
      localStorage.setItem("currentOrder", JSON.stringify(newOrder));

      dispatch(clearCart());
      navigate("/order-confirm");
    }, 800);
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
            UPI
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
            EMI Options
          </div>
        </div>

        <div className="middle">

          {selectedMethod === "cod" && (
            <>
              <h3>Cash On Delivery</h3>
              <p className="note">₹10 fee applicable</p>

              <button
                className="continue"
                onClick={() => processPayment("cod")}
              >
                Place Order
              </button>
            </>
          )}

          {selectedMethod === "upi" && (
            <UPIPayment
              amount={Number(finalTotal.toFixed(2))}
              onSuccess={(res) =>
                processPayment("upi", {
                   upiId: res?.upiId,
                })
              }
            />
          )}

          {selectedMethod === "card" && (
            <CardPayment
              loading={loading}
              onSuccess={() => processPayment("card")}
            />
          )}

          {selectedMethod === "emi" && (
            <EmiPayment
              amount={Number(finalTotal.toFixed(2))}
              loading={loading}
              onSuccess={(emiData) =>
                processPayment("emi", emiData)
              }
            />
          )}

        </div>

        <div className="summary-section">
          <h4>ESTIMATED DELIVERY</h4>
          <p>{deliveryDate.toDateString()}</p>

          <div className="price-row">
            <span>Price</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>

          <div className="price-row green">
            <span>Discount</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>

          <div className="price-row">
            <span>Platform Fee</span>
            <span>₹{platformFee.toFixed(2)}</span>
          </div>

          {selectedMethod === "cod" && (
            <div className="price-row">
              <span>COD Fee</span>
              <span>₹{codFee.toFixed(2)}</span>
            </div>
          )}

          <hr />

          <div className="total">
            <span>Total</span>
            <span>₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PaymentPage;