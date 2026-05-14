import React from "react";
import { useNavigate } from "react-router-dom";
import "../layout/BestSeller.css";

export default function BestSeller() {
    const navigate = useNavigate();

    return (


        <div className="trending-wrapper">

            <div className="deal-card">
                <div className="deal-image">

                    <img src="/images/watch.jpg" alt="watch"
                    />
                </div>

                <div className="deal-content">
                    <span className="tag">Best Sellers</span>

                    <h2>Trending Top Deals</h2>

                    <p>
                        <p>
                            Explore top shopping destinations for fashion, electronics, accessories,
                            and everyday essentials. Find trending products, exclusive discounts,
                            and premium collections all in one place with a smooth and secure
                            shopping experience.
                        </p>
                    </p>

                    <button onClick={() => navigate("/products")}>
                        See all Products
                    </button>
                </div>
            </div>



        </div>



    );
}