import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  incrementQuantity,
  decrementQuantity
} from "./cartSlice";
import { selectCartArray, selectCartTotalPrice } from "./cartSelectors";
import { useNavigate } from "react-router-dom";
import "./cart.css";

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(selectCartArray);
  const total = useSelector(selectCartTotalPrice);

  return (
    <div className="cart-container">

      <div className="step-header">
        <div className="step completed">
          <div className="step-circle">✓</div>
          <span className="step-label">My Cart</span>
        </div>

        <div className="step active">
          <div className="step-circle">2</div>
          <span className="step-label">Address</span>
        </div>

        <div className="step">
          <div className="step-circle">3</div>
          <span className="step-label">Payment</span>
        </div>

        <div className="step">
          <div className="step-circle">4</div>
          <span className="step-label">Order Confirm</span>
        </div>
      </div>

      <div className="nav-buttons">
        <button className="back-btn" onClick={() => navigate("/")}>
          Back to HomePage
        </button>

        <button
          className="back-btn"
          onClick={() => navigate("/Products-table")}
        >
          Back to Products Table
        </button>
      </div>

      <h2 className="cart-title">Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart">Your cart is empty</div>
      ) : (
        <div className="checkout-layout">

          <div className="cart-list">
            {cartItems.map(item => (
              <div key={item.id} className="cart-card">

                <img src={item.thumbnail} alt={item.title} />

                <div className="cart-info">
                  <h4>{item.title}</h4>
                  <p className="price">₹ {item.price}</p>

                  <div className="qty-controls">
                    <button onClick={() => dispatch(decrementQuantity(item.id))}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => dispatch(incrementQuantity(item.id))}>+</button>
                  </div>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  Remove
                </button>

              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Total: ₹ {total.toFixed(2)}</h3>

            <button
              className="continue-btn"
              onClick={() => navigate("/address")}
            >
              Continue
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

export default CartPage;