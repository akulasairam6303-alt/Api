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

  const getStatus = (date) => {
    const orderTime = new Date(date).getTime();
    const now = Date.now();
    const diff = now - orderTime;

    if (diff < 10000) return "Order Placed";
    if (diff < 24 * 60 * 60 * 1000) return "Processing";
    if (diff < 4 * 24 * 60 * 60 * 1000) return "Shipped";
    return "Delivered";
  };

  const getStatusClass = (status) => {
    if (status === "Order Placed") return "status gray";
    if (status === "Processing") return "status orange";
    if (status === "Shipped") return "status blue";
    return "status green";
  };

  const getCountdown = (date) => {
    const orderTime = new Date(date).getTime();

    let targetTime;

    const now = Date.now();
    const diff = now - orderTime;

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
        const status = getStatus(order.date);

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
                  {getCountdown(order.date)}
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

          </div>
        );
      })}

    </div>
  );
}

export default OrdersPage;