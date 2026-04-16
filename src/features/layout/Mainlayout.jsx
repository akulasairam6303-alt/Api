import { Outlet, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaShoppingCart, FaHeart, FaBox } from "react-icons/fa";
import { logout } from "../auth/authSlice";
import "./layout.css";

function MainLayout() {

  const cartCount = useSelector(state =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );

  const wishlistCount = useSelector(state => state.wishlist.items.length);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <div className="navbar">
        <h2 className="logo">ECOMMERCE</h2>

        <div className="icon-container">

          {/* 🆕 ORDERS */}
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

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>

        </div>
      </div>

      <div className="page-content">
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;