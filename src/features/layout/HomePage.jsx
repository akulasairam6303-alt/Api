import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaBox, FaMapMarkerAlt } from "react-icons/fa";
import { logout } from "../../utils/logout";
import "../layout/HomePage.css";

function LandingPage() {
    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState(false);

    const cartCount = useSelector(state =>
        state.cart.items.reduce((total, item) => total + item.quantity, 0)
    );

    const wishlistCount = useSelector(state => state.wishlist.items.length);

    const user = JSON.parse(localStorage.getItem("user"));
    const isAuthenticated = !!user;

    const handleLogout = () => {
        logout(null, navigate);
    };


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

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const prev = () => {
        setIndex(prev => (prev - 1 + slides.length) % slides.length);
    };

    const next = () => {
        setIndex(prev => (prev + 1) % slides.length);
    };

    return (
        <>
            <div className="landing-navbar">
                <div className="logo">ECOMMERCE</div>

                <div className="location">
                    <FaMapMarkerAlt />
                    <span>Turn On Your Location</span>
                </div>

                <input className="search-bar" placeholder="Explore products..." />

                <div className="nav-actions">
                    <button className="seller-btn">Seller Dashboard</button>

                    <div className="icon-container">
                        <Link to="/orders" className="icon"><FaBox /></Link>
                        <Link to="/cart" className="icon">
                            <FaShoppingCart />
                            <span className="badge">{cartCount}</span>
                        </Link>
                        <Link to="/wishlist" className="icon">
                            <FaHeart />
                            <span className="badge">{wishlistCount}</span>
                        </Link>
                    </div>

                    {isAuthenticated ? (
                        <div className="user-menu">
                            <div
                                className="user-trigger"
                                onClick={() => setShowMenu(prev => !prev)}
                            >
                                Hello,{user?.name}
                            </div>

                            {showMenu && (
                                <div className="dropdown">
                                    <div onClick={() => navigate("/profile")}>
                                        Profile
                                    </div>
                                    <div onClick={handleLogout}>
                                        Logout
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            className="login-btn"
                            onClick={() => navigate("/login")}
                        >
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

                        <button
                            className="shop-btn"
                            onClick={() => navigate("/home")}
                        >
                            SHOP NOW
                        </button>
                    </div>

                    <div className="banner-image">
                        <img src={slides[index].image} alt="model" />
                    </div>
                </div>

                <button className="arrow left" onClick={prev}>‹</button>
                <button className="arrow right" onClick={next}>›</button>
            </div>
        </>
    );
}

export default LandingPage;