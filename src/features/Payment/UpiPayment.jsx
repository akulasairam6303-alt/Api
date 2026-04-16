import { useEffect } from "react";

function UPIPayment({ amount, onSuccess }) {

  useEffect(() => {
    console.log("Razorpay:", window.Razorpay);
  }, []);

  const handlePayment = async () => {

    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded");
      return;
    }

    try {
      
      const res = await fetch("http://localhost:5000/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount })
      });

      const order = await res.json();

      if (!order.id) {
        alert("Order creation failed");
        return;
      }

      // ✅ Step 2: open Razorpay
      const options = {
        key: "rzp_test_Se7m1KwIjVriWU",
        amount: order.amount,
        currency: "INR",
        order_id: order.id,

        name: "Test Store",
        description: "UPI Payment",

        handler: async function (response) {
          console.log("SUCCESS", response);

          const verifyRes = await fetch("http://localhost:5000/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(response)
          });

          const data = await verifyRes.json();

          if (data.success) {
            onSuccess(response);
          } else {
            alert("Payment verification failed");
          }
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.log("FAILED", response.error);
        alert("Payment failed");
      });

      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <button className="continue" onClick={handlePayment}>
      Pay Now
    </button>
  );
}

export default UPIPayment;