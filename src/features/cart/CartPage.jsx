import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "./cartSlice";
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
      <div className="nav-buttons">
        <button className="back-btn" onClick={() => navigate("/")}>
          Back to HomePage
        </button>

        <button className="back-btn" onClick={() => navigate("/Products-table")}>
          Back to Products Table
        </button>
      </div>

      <h2 className="cart-title">Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart">Your cart is empty</div>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map(item => (
              <div key={item.id} className="cart-card">
                <div className="cart-info">
                  <h4>{item.title}</h4>
                  <p>Quantity: {item.quantity}</p>
                  <p className="price">₹ {item.price}</p>
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
            Total: ₹ {total.toFixed(2)}
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;


