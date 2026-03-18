import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../products/productSlice";
import { addToCart } from "../cart/cartSlice";
import { addToWishlist } from "../wishlist/wishlistSlice";
import useDebounce from "./useDebounce";
import ProductSkeleton from "../products/ProductSkeleton";
import "./Home.css";
import { useNavigate } from "react-router-dom"; // ✅ ADDED

const ITEMS_PER_PAGE = 12;

const priceRanges = [
  { label: "1 - 100", min: 1, max: 100 },
  { label: "101 - 500", min: 101, max: 500 },
  { label: "501 - 1000", min: 501, max: 1000 },
  { label: "1000+", min: 1001, max: Infinity }
];

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ ADDED

  const { items, loading } = useSelector(state => state.products);

  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 500);

  const [activeRanges, setActiveRanges] = useState([]);
  const [page, setPage] = useState(1);

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

        {/* ✅ ADDED NAV BUTTON */}
        <div className="table-nav" style={{ marginBottom: "10px" }}>
          <button onClick={() => navigate("/products-table")}>
            View Table
          </button>
        </div>

        <div className="searchbar">
          <input
            placeholder="Search products..."
            value={searchText}
            onChange={e => {
              setPage(1);
              setSearchText(e.target.value);
            }}
          />
        </div>

        {loading && <p>Loading...</p>}

        <div className="grid">
          {loading
            ? [...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))
            : paginatedProducts.map(product => (
              <div key={product.id} className="card">
                <img src={product.thumbnail} alt={product.title} />

                <h4>{product.title}</h4>

                <p>₹{product.price}</p>

                <div className="card-actions">
                  <button onClick={() => dispatch(addToCart(product))}>
                    Add to Cart
                  </button>

                  <button onClick={() => dispatch(addToWishlist(product))}>
                    Wishlist
                  </button>
                </div>
              </div>
            ))}
        </div>

        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}

export default HomePage;