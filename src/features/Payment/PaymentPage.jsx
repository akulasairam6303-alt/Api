import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCartArray, selectCartTotalPrice } from "../cart/cartSelectors";
import { clearCart } from "../cart/cartSlice";
import { useNavigate } from "react-router-dom";
import StepHeader from "../StepHeader/StepHeader";
import UPIPayment from "./UPIPayment";
import CardPayment from "./CardPayment";
import EmiPayment from "./EmiPayment";
import { addOrder, saveCurrentOrder } from "../utils/orderStorage";
import { getDeliveryDate } from "../OrderConfirm/OrderLogic";
import "./payment.css";

function PaymentPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartArray);
  const totalPrice = useSelector(selectCartTotalPrice);

  const { addresses, selectedAddressId } = useSelector(
    (state) => state.address
  );


  const selected = addresses.find(
    (a) => String(a.id) === String(selectedAddressId)
  );

  const [selectedMethod, setSelectedMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const discount = Math.round(totalPrice * 0.3);
  const platformFee = totalPrice > 500 ? 0 : 40;
  const codFee = selectedMethod === "cod" && totalPrice <= 500 ? 10 : 0;

  const finalTotal = totalPrice - discount + platformFee + codFee;
  const deliveryDate = getDeliveryDate();

  const processPayment = (method, extra = {}) => {

    console.log("PROCESS PAYMENT:", {
      cartItems,
      selected,
      selectedAddressId,
    });

    if (loading) return;

    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    if (!selected) {
      alert("No address selected");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        const newOrder = {
          id: Date.now(),
          items: [...cartItems],


          address: selected,

          total: Number(finalTotal.toFixed(2)),
          payment: method,

          transactionId:
            extra?.upiId ||
            "TXN" + Math.floor(Math.random() * 1000000),

          emiPlan: method === "emi" ? extra : null,
          date: new Date().toISOString(),
        };

        addOrder(newOrder);
        saveCurrentOrder(newOrder);

        dispatch(clearCart());

        navigate("/order-confirmation");
      } catch (err) {
        console.error("ORDER ERROR:", err);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="cart-container">
      <StepHeader currentStep={3} />

      <div className="payment-box">
        <div className="left">
          <h3>Choose Payment Mode</h3>

          {["cod", "upi", "card", "emi"].map((method) => (
            <div
              key={method}
              className={`method ${selectedMethod === method ? "active" : ""
                }`}
              onClick={() => setSelectedMethod(method)}
            >
              {method.toUpperCase()}
            </div>
          ))}
        </div>

        <div className="middle">
          {selectedMethod === "cod" && (
            <>
              <h3>Cash On Delivery</h3>


              <p className="note">
                {totalPrice <= 500
                  ? "₹10 fee applicable"
                  : "No COD fee"}
              </p>

              <button
                className="continue"
                disabled={!selected || cartItems.length === 0 || loading}
                onClick={() => processPayment("cod")}
              >
                {loading ? "Processing..." : "Place Order"}
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
          <h4>ESTIMATED DELIVERY TIME</h4>
          <p className="date">{deliveryDate.toDateString()}</p>

          <div className="price-row">
            <span>Price</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>

          <div className="price-row green">
            <span>Discount (30%)</span>
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
            <span>Total Price</span>
            <span>₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;