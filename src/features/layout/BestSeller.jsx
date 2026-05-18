import React from "react";
import { useNavigate } from "react-router-dom";
import "../layout/BestSeller.css";

export default function BestSeller() {
    const navigate = useNavigate();

    return (
        <div className="trending-wrapper">

            {/* First Section */}
            <div className="deal-card">

                <div className="deal-image">
                    <img
                        src="/images/watch.jpg"
                        alt="watch"
                    />
                </div>

                <div className="deal-content">
                    <span className="tag">Best Sellers</span>

                    <h2>Trending Top Deals</h2>

                    <p>
                        Explore top shopping destinations for fashion,
                        electronics, accessories, and everyday essentials.
                    </p>

                    <button onClick={() => navigate("/products")}>
                        See all Products
                    </button>
                </div>

            </div>

            {/* Second Section */}
            <div className="deal-card">

                <div className="deal-image">
                    <img
                        src="/images/shoe.jpg"
                        alt="shoes"
                    />
                </div>

                <div className="deal-content">
                    <span className="tag">New Arrivals</span>

                    <h2>Latest Fashion Collection</h2>

                    <p>
                        Discover stylish new arrivals including shoes,
                        clothing, accessories, and lifestyle products.
                    </p>

                    <button onClick={() => navigate("/products")}>
                        Shop Now
                    </button>
                </div>

            </div>

        </div>
    );
}