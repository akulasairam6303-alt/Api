import { useEffect, useState } from "react";
import "./orders.css";

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

    const orderTime = new Date(date).getTime();
    const now = Date.now();
    const diff = now - orderTime;

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

    const orderTime = new Date(date).getTime();
    const now = Date.now();
    const diff = now - orderTime;

    let targetTime;

    if (diff < 10000) {
      targetTime = orderTime + 10000;
    } else if (diff < 24 * 60 * 60 * 1000) {
      targetTime = orderTime + 24 * 60 * 60 * 1000;
    } else if (diff < 4 * 24 * 60 * 60 * 1000) {
      targetTime = orderTime + 4 * 24 * 60 * 60 * 1000;
    } else {
      return "Delivered";
    }

    const remaining = targetTime - now;

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining / (1000 * 60)) % 60);
    const seconds = Math.floor((remaining / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const canCancel = (date) => {
    const orderTime = new Date(date).getTime();
    const now = Date.now();
    const diff = now - orderTime;

    return diff <= 2 * 60 * 60 * 1000;
  };

  const getCancelRemaining = (date) => {
    const orderTime = new Date(date).getTime();
    const now = Date.now();
    const diff = now - orderTime;

    const remaining = 2 * 60 * 60 * 1000 - diff;

    if (remaining <= 0) return "Cancel window closed";

    const minutes = Math.floor(remaining / (1000 * 60));
    const seconds = Math.floor((remaining / 1000) % 60);

    return `Cancel available for ${minutes}m ${seconds}s`;
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
                ₹{order.total}
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

            {!order.cancelled && (
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