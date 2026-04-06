import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../cart/cartSlice";
import "./ProductTable.css";

function ProductTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [minRating, setMinRating] = useState("");

  
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    category: "",
    brand: "",
    minRating: ""
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch("https://dummyjson.com/products");
        const data = await res.json();

        setProducts(data.products || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();  
  }, []);

  
  const categories = [...new Set(products.map(p => p.category))];
  const brands = [...new Set(products.map(p => p.brand))];

  
  const handleApplyFilters = () => {
    setAppliedFilters({
      search,
      minPrice,
      maxPrice,
      category,
      brand,
      minRating
    });
  };

  
  const handleClearFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setCategory("");
    setBrand("");
    setMinRating("");

    setAppliedFilters({
      search: "",
      minPrice: "",
      maxPrice: "",
      category: "",
      brand: "",
      minRating: ""
    });
  };

  
  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(appliedFilters.search.toLowerCase());

    const matchesMin = appliedFilters.minPrice
      ? item.price >= Number(appliedFilters.minPrice)
      : true;

    const matchesMax = appliedFilters.maxPrice
      ? item.price <= Number(appliedFilters.maxPrice)
      : true;

    const matchesCategory = appliedFilters.category
      ? item.category === appliedFilters.category
      : true;

    const matchesBrand = appliedFilters.brand
      ? item.brand === appliedFilters.brand
      : true;

    const matchesRating = appliedFilters.minRating
      ? item.rating >= Number(appliedFilters.minRating)
      : true;

    return (   
      matchesSearch &&
      matchesMin &&
      matchesMax &&
      matchesCategory &&
      matchesBrand &&
      matchesRating
    );
  });

  return (
    <div className="table-container">

      <div className="back-nav">
        <button onClick={() => navigate("/")}>
          Back to Homepage
        </button>
      </div>

      <h2>Product Table</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Rating (e.g. 4)"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        />

        
        <button onClick={handleApplyFilters}>
          Apply Filters
        </button>

        <button onClick={handleClearFilters}>
          Clear Filters
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img src={item.thumbnail} alt={item.title} />
                  </td>

                  <td>{item.title}</td>
                  <td>{item.brand}</td>
                  <td>{item.category}</td>
                  <td>₹{item.price}</td>
                  <td>{item.rating}</td>
                  <td>{item.stock}</td>

                  <td>
                    <button onClick={() => dispatch(addToCart(item))}>
                      Add to Cart
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProductTable;