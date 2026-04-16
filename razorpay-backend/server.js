const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(express.json());
app.use(cors());


const KEY_ID = "rzp_test_Se92bvHBi36lgn";
const KEY_SECRET = "m3Q47H5HvS30utLt0zsrloX7";

const razorpay = new Razorpay({
  key_id: KEY_ID,
  key_secret: KEY_SECRET
});


app.get("/", (req, res) => {
  res.send("Server is working");
});



app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    console.log("Creating order for amount:", amount);

    const order = await razorpay.orders.create({
      amount: amount * 100, 
      currency: "INR",
      receipt: "receipt_" + Date.now()
    });

    console.log("Order created:", order.id);

    res.json(order);

  } catch (err) {
    console.error("❌ FULL ERROR:", err);
    res.status(500).json({
      error: err.message || "Order creation failed"
    });
  }
});



app.post("/verify-payment", (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false });
    }

  } catch (err) {
    console.error("❌ VERIFY ERROR:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});



app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});