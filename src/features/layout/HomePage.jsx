import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaBox, FaMapMarkerAlt } from "react-icons/fa";
import { logout } from "../auth/authSlice";
import "../layout/HomePage.css";

function HomePage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showMenu, setShowMenu] = useState(false);
    const [index, setIndex] = useState(0);

    const cartCount = useSelector(state =>
        state.cart.items.reduce((total, item) => total + item.quantity, 0)
    );
    const wishlistCount = useSelector(state => state.wishlist.items.length);
    const user = useSelector(state => state.auth.user);
    const isAuthenticated = !!user;

    const slides = [
        {
            image: "/images/image1.jpg",
            title: "Shop Smart, Live Better",
            subtitle: "Trendy, reliable, and innovative products."
        },
        {
            image: "/images/image2.jpg",
            title: "Discover New Styles",
            subtitle: "Upgrade your wardrobe with latest fashion."
        },
        {
            image: "/images/image3.jpg",
            title: "Best Deals Everyday",
            subtitle: "Unbeatable prices on top products."
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const handleLogout = () => {
        dispatch(logout());
        setShowMenu(false);
        navigate("/");
    };

    const protectedNav = (path) => {
        if (isAuthenticated) {
            navigate(path);
        } else {
            navigate("/login");
        }
    };

    const prev = () => setIndex(prev => (prev - 1 + slides.length) % slides.length);
    const next = () => setIndex(prev => (prev + 1) % slides.length);

    return (
        <>
            <div className="landing-navbar">
                <div className="logo" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
                    ECOMMERCE
                </div>

                <div className="location">
                    <FaMapMarkerAlt />
                    <span>Turn On Your Location</span>
                </div>

                <input className="search-bar" placeholder="Explore products..." />

                <div className="nav-actions">
                    <button className="seller-btn">Seller Dashboard</button>

                    <div className="icon-container">
                        <div className="icon" onClick={() => protectedNav("/orders")}>
                            <FaBox />
                        </div>

                        <div className="icon" onClick={() => protectedNav("/cart")}>
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

                    {isAuthenticated ? (
                        <div className="user-menu">
                            <div className="user-greeting" onClick={() => setShowMenu(prev => !prev)}>
                                Hello, {user?.name || "User"}
                            </div>

                            {showMenu && (
                                <div className="dropdown">
                                    <div onClick={() => { navigate("/profile"); setShowMenu(false); }}>Profile</div>
                                    <div onClick={handleLogout}>Logout</div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className="login-btn" onClick={() => navigate("/login")}>
                            Login
                        </button>
                    )}
                </div>
            </div>

            <div className="category-bar">
                <span>Accessories</span>
                <span>Appliances</span>
                <span>Electronics</span>
                <span>Fashion</span>
                <span>Food</span>
                <span>Grocery</span>
                <span>New Arrivals</span>
            </div>

            <div className="banner">
                <div className="banner-content">
                    <div className="banner-text">
                        <p className="subtitle">{slides[index].subtitle}</p>
                        <h1 className="title">{slides[index].title}</h1>
                        <p className="description">
                            Choose from a wide range of fashion essentials and cutting-edge electronics.
                        </p>
                        <button className="shop-btn" onClick={() => navigate("/home")}>
                            SHOP NOW
                        </button>
                    </div>

                    <div className="banner-image">
                        <img src={slides[index].image} alt="slide" />
                    </div>
                </div>

                <button className="arrow left" onClick={prev}>‹</button>
                <button className="arrow right" onClick={next}>›</button>
            </div>
        </>
    );
}

export default HomePage;