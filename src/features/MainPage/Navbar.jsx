import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="logo">Ecommerce</h2>
        <button className="location-btn"> Enable location access</button>
      </div>

      <div className="navbar-center">
        <input
          type="text"
          placeholder="Explore brands, products, and deals..."
        />
      </div>

      <div className="navbar-right">
        <button className="seller-btn">Seller Dashboard</button>
        <button className="user-btn">Hello, User</button>
      </div>
    </nav>
  );
};

export default Navbar;