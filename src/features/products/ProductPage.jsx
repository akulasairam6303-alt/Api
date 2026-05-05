import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./productSlice";
import { addToCart } from "../cart/cartSlice";
import { addToWishlist } from "../wishlist/wishlistSlice";
import useDebounce from "./useDebounce";
import { logout } from "../auth/authSlice";
import ProductSkeleton from "./ProductSkeleton";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaBox } from "react-icons/fa";
import { clearCart } from "../cart/cartSlice";
import { clearWishlist } from "../wishlist/wishlistSlice";
import "../products/Product.css";

const ITEMS_PER_PAGE = 12;

const priceRanges = [
  { label: "1 - 100", min: 1, max: 100 },
  { label: "101 - 500", min: 101, max: 500 },
  { label: "501 - 1000", min: 501, max: 1000 },
  { label: "1000+", min: 1001, max: Infinity }
];

function ProductPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, loading } = useSelector(state => state.products);
  const user = useSelector(state => state.auth.user);
  const isAuthenticated = !!user;

  const cartCount = useSelector(state =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );

  const wishlistCount = useSelector(state => state.wishlist.items.length);

  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 500);

  const [activeRanges, setActiveRanges] = useState([]);
  const [page, setPage] = useState(1);

  const protectedNav = (path) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: path } });
      return;
    }
    navigate(path);
  };

  const handleWishlist = (product) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/products" } });
      return;
    }
    dispatch(addToWishlist(product));
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    dispatch(clearWishlist());
    navigate("/");
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    return items.filter(product => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());

      const matchesPrice =
        activeRanges.length === 0 ||
        activeRanges.some(label => {
          const range = priceRanges.find(r => r.label === label);
          return (
            product.price >= range.min &&
            product.price <= range.max
          );
        });

      return matchesSearch && matchesPrice;
    });
  }, [items, debouncedSearch, activeRanges]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const clearFilters = () => {
    setActiveRanges([]);
    setSearchText("");
    setPage(1);
  };

  return (
    <div className="home-container">

      <div className="sidebar">
        <h3>Filter by Price</h3>

        {priceRanges.map(range => (
          <label key={range.label}>
            <input
              type="checkbox"
              checked={activeRanges.includes(range.label)}
              onChange={() => {
                setPage(1);
                setActiveRanges(prev =>
                  prev.includes(range.label)
                    ? prev.filter(r => r !== range.label)
                    : [...prev, range.label]
                );
              }}
            />
            ₹{range.label}
          </label>
        ))}

        <button className="clear-filter" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      <div className="content">

        <div className="top-bar">

          <input
            className="searchbar"
            placeholder="Search products..."
            value={searchText}
            onChange={(e) => {
              setPage(1);
              setSearchText(e.target.value);
            }}
          />

          <div className="icon-container">

            <div className="icon" onClick={() => protectedNav("/orders")}>
              <FaBox />
            </div>

            <div className="icon" onClick={() => navigate("/cart")}>
              <FaShoppingCart />
              {isAuthenticated && cartCount > 0 && (
                <span className="badge">{cartCount}</span>
              )}
            </div>

            <div className="icon" onClick={() => protectedNav("/wishlist")}>
              <FaHeart />
              {isAuthenticated && wishlistCount > 0 && (
                <span className="badge">{wishlistCount}</span>
              )}
            </div>

          </div>

          <div className="table-nav">
            <button onClick={() => navigate("/products-table")}>
              View Table
            </button>
          </div>

          {isAuthenticated && (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}

        </div>

        {loading && <p>Loading...</p>}

        <div className="grid">
          {paginatedProducts.map(product => (
            <div key={product.id} className="card">

              <div className="img-box">
                <img src={product.thumbnail} alt={product.title} />
              </div>

              <div className="card-info">
                <h4>{product.title}</h4>
                <p>₹{product.price}</p>
              </div>

              <div className="card-actions">
                <button onClick={() => dispatch(addToCart(product))}>
                  Add to Cart
                </button>

                <button onClick={() => handleWishlist(product)}>
                  Wishlist
                </button>
              </div>

            </div>
          ))}
        </div>

        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>

      </div>
    </div>
  );
}

export default ProductPage;