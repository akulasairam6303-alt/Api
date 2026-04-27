import { useEffect, useState } from "react";
import StepHeader from "../StepHeader/StepHeader";
import "./OrderConfirm.css";
import { useNavigate } from "react-router-dom";

import {
  getStage,
  getStatusText,
  getStatusClass,
  formatAddress,
  getDeliveryDate,
  getDeliveryMessage
} from "./OrderLogic";

function OrderConfirmPage() {
  const [order, setOrder] = useState(null);
  const [stage, setStage] = useState(1);

  const [redirecting, setRedirecting] = useState(true);
  const [countdown, setCountdown] = useState(4);

  const navigate = useNavigate();

  // Load order
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("currentOrder"));
    setOrder(stored);
  }, []);

  // ✅ FIXED TIMER (clean + predictable)
  useEffect(() => {
    if (!redirecting) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [redirecting, navigate]);

  // Order stage tracking
  useEffect(() => {
    const updateStage = () => {
      const stored = JSON.parse(localStorage.getItem("currentOrder"));
      if (!stored) return;

      const newStage = getStage(stored.date);
      setStage(newStage);

      if (newStage === 4 && !stored.deliveredAt) {
        stored.deliveredAt = new Date().toISOString();
        localStorage.setItem("currentOrder", JSON.stringify(stored));
        setOrder(stored);
      }
    };

    updateStage();
    const interval = setInterval(updateStage, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!order) {
    return <div className="cart-container">No Order Found</div>;
  }

  const deliveryDate = getDeliveryDate(order.date, order.deliveredAt);
  const message = getDeliveryMessage(stage, deliveryDate);

  return (
    <div className="cart-container">
      <StepHeader currentStep={4} />

      <div className="order-box">

        {order.payment !== "cod" ? (
          <div className="success-banner">
            <div className="success-icon">✓</div>
            <div>
              <h3>Order Confirmed</h3>
              <p>Payment of ₹{order.total?.toFixed(2)} successful</p>
            </div>
          </div>
        ) : (
          <div className="cod-banner">
            <div className="cod-icon">₹</div>
            <div>
              <h3>Order Placed</h3>
              <p>Pay ₹{order.total?.toFixed(2)} on delivery</p>
            </div>
          </div>
        )}

        {redirecting && (
          <div className="redirect-box">
            <p>
              Redirecting to home in <strong>{countdown}</strong> sec...
            </p>
            <button
              onClick={() => {
                setRedirecting(false);
                setCountdown(4);
              }}
            >
              Stay here
            </button>
          </div>
        )}

        <h2>Thank you for your order</h2>
        <p className="order-id">Order ID # {order.id}</p>

        <p className={getStatusClass(getStatusText(stage))}>
          {getStatusText(stage)}
        </p>

        <p className="countdown">{message}</p>

        <div className="tracker">
          <div className={`track ${stage >= 1 ? "done" : ""}`}>
            <div className="dot"></div>
            <span>Order Placed</span>
          </div>

          <div className="line"></div>

          <div className={`track ${stage >= 2 ? "done" : ""}`}>
            <div className="dot"></div>
            <span>Processing</span>
          </div>

          <div className="line"></div>

          <div className={`track ${stage >= 3 ? "done" : ""}`}>
            <div className="dot"></div>
            <span>Shipped</span>
          </div>

          <div className="line"></div>

          <div className={`track ${stage >= 4 ? "done" : ""}`}>
            <div className="dot"></div>
            <span>Delivered</span>
          </div>
        </div>

        <div className="info-box">
          <p className="note">
            You’ll receive shipping updates as your order progresses.
          </p>

          <div className="grid">
            <div>
              <h4>Order Details</h4>
              <p>
                {stage === 4
                  ? `Delivered on ${deliveryDate.toDateString()}`
                  : `Arriving by ${deliveryDate.toDateString()}`
                }
              </p>
              <p>Sold by Ecommerce</p>
              <p>Order ID # {order.id}</p>
            </div>

            <div>
              <h4>Billing Address</h4>
              <p>{order.address?.name}</p>
              <p>{formatAddress(order.address)}</p>
              <p>{order.address?.phone}</p>
            </div>

            <div>
              <h4>Payment Details</h4>

              {order.payment === "upi" && (
                <>
                  <p>UPI</p>
                  <p>UPI ID: {order.transactionId}</p>
                  <p>Paid ₹{order.total?.toFixed(2)}</p>
                </>
              )}

              {order.payment === "card" && (
                <>
                  <p>Card</p>
                  <p>Transaction ID: {order.transactionId}</p>
                  <p>Paid ₹{order.total?.toFixed(2)}</p>
                </>
              )}

              {order.payment === "emi" && (
                <>
                  <p>EMI</p>
                  <p>Transaction ID: {order.transactionId}</p>
                  <p>{order.emiPlan?.months} months plan</p>
                  <p>Paid ₹{order.total?.toFixed(2)}</p>
                </>
              )}

              {order.payment === "cod" && (
                <>
                  <p>Cash on Delivery</p>
                  <p>Pay ₹{order.total?.toFixed(2)} at delivery</p>
                </>
              )}
            </div>

            <div>
              <h4>Shipping Address</h4>
              <p>{order.address?.name}</p>
              <p>{formatAddress(order.address)}</p>
              <p>{order.address?.phone}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OrderConfirmPage;