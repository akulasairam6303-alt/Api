import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./MainPage.css";

const images = [
  "https://source.unsplash.com/1600x600/?shopping",
  "https://source.unsplash.com/1600x600/?fashion",
  "https://source.unsplash.com/1600x600/?electronics",
];

const MainPage = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <Navbar />

      <div className="categories">
        {[
          "Accessories",
          "Appliances",
          "Electronics",
          "Fashion",
          "Food",
          "Grocery",
          "New Arrivals",
        ].map((cat, i) => (
          <button key={i}>{cat}</button>
        ))}
      </div>

      <div className="hero">
        <div className="hero-left">
          <h3>Trendy, reliable, and innovative products.</h3>
          <h1>Shop Smart, Live Better</h1>
          <p>
            Choose from a wide range of fashion essentials and cutting-edge
            electronics at unbeatable prices.
          </p>

          <button
            className="shop-btn"
            onClick={() => navigate("/signup")}
          >
            SHOP NOW
          </button>
        </div>

        <div className="hero-right">
          <button onClick={prevSlide}>❮</button>
          <img src={images[index]} alt="carousel" />
          <button onClick={nextSlide}>❯</button>
        </div>
      </div>
    </>
  );
};

export default MainPage;