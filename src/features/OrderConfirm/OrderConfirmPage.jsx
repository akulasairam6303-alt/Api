import { useEffect, useState } from "react";
import StepHeader from "../StepHeader/StepHeader";
import "../OrderConfirm/OrderConfirm.css";

function OrderConfirmPage() {
    const [order, setOrder] = useState(null);
    const [stage, setStage] = useState(1);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("currentOrder"));
        setOrder(stored);
    }, []);

    useEffect(() => {
        const updateStage = () => {
            const stored = JSON.parse(localStorage.getItem("currentOrder"));
            if (!stored) return;

            const orderTime = new Date(stored.date).getTime();
            const now = Date.now();
            const diff = now - orderTime;

            if (diff < 10000) setStage(1);
            else if (diff < 24 * 60 * 60 * 1000) setStage(2);
            else if (diff < 4 * 24 * 60 * 60 * 1000) setStage(3);
            else setStage(4);
        };

        updateStage();
        const interval = setInterval(updateStage, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!order) {
        return <div className="cart-container">No Order Found</div>;
    }

    const deliveryDate = new Date(order.date);
    deliveryDate.setDate(deliveryDate.getDate() + 3);

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

                <h2>Thank you for Your Order</h2>
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

                        {/* ✅ FIXED PAYMENT SECTION */}
                        <div>
                            <h4>Payment Details</h4>

                            {order.payment === "upi" ? (
                                <>
                                    <p>UPI (Paid)</p>
                                    <p>Payment ID: {order.razorpay_payment_id}</p>
                                    <p>Paid ₹{order.total} successfully.</p>
                                </>
                            ) : (
                                <>
                                    <p>COD - Cash on Delivery</p>
                                    <p>Pay ₹{order.total} when your order is delivered.</p>
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