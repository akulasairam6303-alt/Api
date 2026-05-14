import React from "react";
import { useNavigate } from "react-router-dom";
import "../layout/BestSeller.css";

export default function BestSeller() {
     const navigate = useNavigate();

  return (

    
    <div className="trending-wrapper">
      
      <div className="deal-card">
        <div className="deal-image">

          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop"
            alt="watch"
          />
        </div>

        <div className="deal-content">
          <span className="tag">Best Sellers</span>

          <h2>Trending Top Deals</h2>

          <p>
            Discover unbeatable offers on fashion and electronics.
            Handpicked daily to bring style and savings together
          </p>

          <button onClick={() => navigate("/products")}>
            See all Products
            </button>
        </div>
      </div>

  
    
        </div>

        
     
  );
}