import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./LandingPage.css";

function LandingPage() {
    const navigate = useNavigate();

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
            setIndex((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const prev = () => {
        setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const next = () => {
        setIndex((prev) => (prev + 1) % slides.length);
    };

    return (
        <>
            <div className="landing-navbar">
                <div className="logo">ECOMMERCE</div>

                <input
                    className="search-bar"
                    placeholder="Explore brands, products, and deals..."
                />

                <div className="nav-actions">
                    <button className="seller-btn">Seller Dashboard</button>
                    <button className="login-btn" onClick={() => navigate("/login")}>
                        Login
                    </button>
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
                <img
                    src={slides[index].image}
                    alt="banner"
                    className="banner-img"
                    onError={(e) => {
                        e.target.src = "https://via.placeholder.com/1600x500?text=Image+Failed";
                    }}
                />

                <div className="overlay">
                    <p className="subtitle">{slides[index].subtitle}</p>

                    <h1 className="title">{slides[index].title}</h1>

                    <p className="description">
                        Choose from a wide range of fashion essentials and cutting-edge
                        electronics at unbeatable prices.
                    </p>

                    <button className="shop-btn" onClick={() => navigate("/app")}>
                        Shop Now
                    </button>
                </div>

                <button className="arrow left" onClick={prev}>‹</button>
                <button className="arrow right" onClick={next}>›</button>
            </div>
        </>
    );
}

export default LandingPage;