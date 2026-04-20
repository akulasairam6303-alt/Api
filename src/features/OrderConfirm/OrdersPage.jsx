import { useEffect, useState } from "react";
import "./orders.css";

const DEMO_MODE = false;

function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders([...stored].reverse());
  }, []);

  const formatAddress = (addr) => {
    if (!addr) return "";

    const a = addr.address || addr;

    const parts = [
      a.flat,
      a.area,
      a.city,
      a.district,
      a.state,
      a.pincode && `- ${a.pincode}`
    ].filter(Boolean);

    return parts.join(", ");
  };

  const getStatus = (date, order) => {
    if (order.cancelled) return "Cancelled";

    const diff = Date.now() - new Date(date).getTime();

    if (DEMO_MODE) {
      if (diff < 3000) return "Order Placed";
      if (diff < 6000) return "Processing";
      if (diff < 9000) return "Shipped";
      return "Delivered";
    }

    if (diff < 10000) return "Order Placed";
    if (diff < 24 * 60 * 60 * 1000) return "Processing";
    if (diff < 4 * 24 * 60 * 60 * 1000) return "Shipped";

    return "Delivered";
  };

  const getStatusClass = (status) => {
    if (status === "Cancelled") return "status red";
    if (status === "Order Placed") return "status gray";
    if (status === "Processing") return "status orange";
    if (status === "Shipped") return "status blue";
    return "status green";
  };

  const getCountdown = (date, order) => {
    if (order.cancelled) return "Cancelled";

    const status = getStatus(date, order);
    if (status === "Delivered") return "Delivered";

    const orderTime = new Date(date).getTime();
    const now = Date.now();

    let targetTime;

    if (DEMO_MODE) {
      if (status === "Order Placed") targetTime = orderTime + 3000;
      else if (status === "Processing") targetTime = orderTime + 6000;
      else if (status === "Shipped") targetTime = orderTime + 9000;
    } else {
      if (status === "Order Placed") targetTime = orderTime + 10000;
      else if (status === "Processing") targetTime = orderTime + 24 * 60 * 60 * 1000;
      else if (status === "Shipped") targetTime = orderTime + 4 * 24 * 60 * 60 * 1000;
    }

    const remaining = targetTime - now;

    if (DEMO_MODE) {
      const seconds = Math.max(0, Math.floor(remaining / 1000));
      return `${seconds}s`;
    }

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining / (1000 * 60)) % 60);
    const seconds = Math.floor((remaining / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const canCancel = (date) => {
    const diff = Date.now() - new Date(date).getTime();

    if (DEMO_MODE) return diff < 5000;

    return diff <= 2 * 60 * 60 * 1000;
  };

  const getCancelRemaining = (date) => {
    const diff = Date.now() - new Date(date).getTime();

    let remaining;

    if (DEMO_MODE) {
      remaining = 5000 - diff;
    } else {
      remaining = 2 * 60 * 60 * 1000 - diff;
    }

    if (remaining <= 0) return "Cancellation window closed";

    const minutes = Math.floor(remaining / (1000 * 60));
    const seconds = Math.floor((remaining / 1000) % 60);

    return DEMO_MODE
      ? `Cancel in ${seconds}s`
      : `Cancellation available upto ${minutes}m ${seconds}s`;
  };

  const handleCancel = (id) => {
    const stored = JSON.parse(localStorage.getItem("orders")) || [];

    const updated = stored.map(order =>
      order.id === id ? { ...order, cancelled: true } : order
    );

    localStorage.setItem("orders", JSON.stringify(updated));
    setOrders([...updated].reverse());
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prev => [...prev]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (orders.length === 0) {
    return (
      <div className="orders-container">
        <h2>Your Orders</h2>
        <p>No orders found</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>

      {orders.map(order => {
        const status = getStatus(order.date, order);

        return (
          <div key={order.id} className="order-card">

            <div className="order-header">
              <div>
                <p className="order-id">Order ID: {order.id}</p>
                <p className="order-date">
                  {new Date(order.date).toLocaleString()}
                </p>

                <p className={getStatusClass(status)}>
                  {status}
                </p>

                <p className="countdown">
                  {getCountdown(order.date, order)}
                </p>
              </div>

              <div className="order-total">
                ₹{order.total?.toFixed(2)}
              </div>
            </div>

            <div className="order-items">
              {order.items?.map(item => (
                <div key={item.id} className="order-item">
                  <img src={item.thumbnail} alt={item.title} />
                  <div>
                    <p>{item.title}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-details">
              <div>
                <h4>Shipping</h4>
                <p>{order.address?.name}</p>
                <p>{formatAddress(order.address)}</p>
                <p>{order.address?.phone}</p>
              </div>

              <div>
                <h4>Payment</h4>
                <p>{order.payment?.toUpperCase()}</p>
              </div>
            </div>

            {!order.cancelled && status !== "Delivered" && (
              <div className="order-actions">

                <button
                  className="cancel-btn"
                  disabled={!canCancel(order.date)}
                  onClick={() => handleCancel(order.id)}
                >
                  {canCancel(order.date) ? "Cancel Order" : "Cannot Cancel"}
                </button>

                <p className="cancel-timer">
                  {getCancelRemaining(order.date)}
                </p>

              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}

export default OrdersPage;