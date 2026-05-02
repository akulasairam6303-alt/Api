import { Outlet, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaShoppingCart, FaHeart, FaBox } from "react-icons/fa";
import { logout } from "../auth/authSlice";
import { resetCart } from "../cart/cartSlice";
import "./layout.css";

function MainLayout() {

  const cartCount = useSelector(state =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );

  const wishlistCount = useSelector(state => state.wishlist.items.length);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetCart());
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <>
      <div className="navbar">
        <h2 className="logo">ECOMMERCE</h2>

        <div className="icon-container">

          <Link to="/orders" className="icon">
            <FaBox />
          </Link>

          <Link to="/cart" className="icon">
            <FaShoppingCart />
            <span className="badge">{cartCount}</span>
          </Link>

          <Link to="/wishlist" className="icon">
            <FaHeart />
            <span className="badge">{wishlistCount}</span>
          </Link>

          {isLoggedIn && (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}

        </div>
      </div>

      <div className="page-content">
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;