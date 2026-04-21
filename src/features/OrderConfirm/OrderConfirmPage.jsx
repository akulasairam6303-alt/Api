import { useEffect, useState } from "react";
import StepHeader from "../StepHeader/StepHeader";
import "./OrderConfirm.css";
import { useNavigate } from "react-router-dom";

const DEMO_MODE = false;

function OrderConfirmPage() {
  const [order, setOrder] = useState(null);
  const [stage, setStage] = useState(1);

  
  const [redirecting, setRedirecting] = useState(true);
  const [countdown, setCountdown] = useState(4);

  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("currentOrder"));
    setOrder(stored);
  }, []);


  useEffect(() => {
    if (!redirecting) return;

    if (countdown === 0) {
      navigate("/");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, redirecting, navigate]);


  useEffect(() => {
    const updateStage = () => {
      const stored = JSON.parse(localStorage.getItem("currentOrder"));
      if (!stored) return;

      const diff = Date.now() - new Date(stored.date).getTime();

      let newStage;

      if (DEMO_MODE) {
        if (diff < 3000) newStage = 1;
        else if (diff < 6000) newStage = 2;
        else if (diff < 9000) newStage = 3;
        else newStage = 4;
      } else {
        if (diff < 10000) newStage = 1;
        else if (diff < 24 * 60 * 60 * 1000) newStage = 2;
        else if (diff < 4 * 24 * 60 * 60 * 1000) newStage = 3;
        else newStage = 4;
      }

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

  const deliveryDate = order.deliveredAt
    ? new Date(order.deliveredAt)
    : new Date(order.date);

  if (!order.deliveredAt) {
    deliveryDate.setDate(deliveryDate.getDate() + 3);
  }

  const formatAddress = (addr) => {
    if (!addr) return "";
    const a = addr.address || addr;

    return [
      a.flat,
      a.area,
      a.city,
      a.district,
      a.state,
      a.pincode && `- ${a.pincode}`
    ]
      .filter(Boolean)
      .join(", ");
  };

  const getStatusText = () => {
    if (stage === 1) return "Order Placed";
    if (stage === 2) return "Preparing your order";
    if (stage === 3) return "Out for delivery";
    return "Delivered";
  };

  const getStatusClass = () => {
    if (stage === 1) return "status gray";
    if (stage === 2) return "status orange";
    if (stage === 3) return "status blue";
    return "status green";
  };

  const getDeliveryMessage = () => {
    const now = new Date();
    const diffTime = deliveryDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (stage === 4) return "Arrived";
    if (diffDays <= 0) return "Arriving Today";
    if (diffDays === 1) return "Arriving Tomorrow";
    if (diffDays <= 5) return `Arriving in ${diffDays} days`;

    return `Expected by ${deliveryDate.toDateString()}`;
  };

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

        <p className={getStatusClass()}>
          {getStatusText()}
        </p>

        <p className="countdown">
          {getDeliveryMessage()}
        </p>

       
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

              {order.payment === "cod" ? (
                <>
                  <p>Cash on Delivery</p>
                  <p>Pay ₹{order.total?.toFixed(2)} at delivery</p>
                </>
              ) : (
                <>
                  <p>Upi Id: {order.transactionId}</p>
                  <p>Paid ₹{order.total?.toFixed(2)}</p>
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