import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "./wishlistSlice";
import { addToCart } from "../cart/cartSlice";
import { useNavigate } from "react-router-dom";
import "./wishlist.css";

function WishlistPage() {
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="wishlist-container">
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      <h2 className="wishlist-title">Your Wishlist</h2>

      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">Your wishlist is empty</div>
      ) : (
        <div className="wishlist-list">
          {wishlistItems.map((item) => (
            <div key={item.id} className="wishlist-card">
              <div className="wishlist-info">
                <h4>{item.title}</h4>
                <p className="price">₹ {item.price}</p>
              </div>

              <div className="wishlist-actions">
                <button
                  className="move-btn"
                  onClick={() => {
                    dispatch(addToCart(item));
                    dispatch(removeFromWishlist(item.id));
                  }}
                >
                  Move to Cart
                </button>

                <button
                  className="remove-btn"
                  onClick={() => dispatch(removeFromWishlist(item.id))}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;