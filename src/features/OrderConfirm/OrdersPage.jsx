import { useEffect, useState } from "react";
import "../OrderConfirm/orders.css";

import {
  getStage,
  getStatusText,
  getStatusClass,
  formatAddress,
  getCountdown,
  canCancel,
  getCancelRemaining
} from "../OrderConfirm/OrderLogic";

function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders([...stored].reverse());
  }, []);

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
        const stage = getStage(order.date);
        const status = order.cancelled
          ? "Cancelled"
          : getStatusText(stage);

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
                  {order.cancelled
                    ? "Cancelled"
                    : getCountdown(order.date, stage)}
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
                  {canCancel(order.date)
                    ? "Cancel Order"
                    : "Cannot Cancel"}
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