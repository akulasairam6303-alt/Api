import {
    useState,
    useEffect
} from "react";

import {
    FaChevronLeft,
    FaChevronRight,
    FaStar
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import "./CategorySection.css";

function CategorySection({
    activeCategory
}) {

    const navigate = useNavigate();

    const [products, setProducts] =
        useState([]);

    const [currentIndex, setCurrentIndex] =
        useState(0);

    useEffect(() => {

        fetch(
            `https://dummyjson.com/products/category/${activeCategory}`
        )
            .then((res) => res.json())
            .then((data) => {

                setProducts(data.products);

                setCurrentIndex(0);

            });

    }, [activeCategory]);

    useEffect(() => {

        if (products.length === 0)
            return;

        const interval = setInterval(() => {

            setCurrentIndex((prev) =>
                prev >= products.length - 1
                    ? 0
                    : prev + 1
            );

        }, 2500);

        return () =>
            clearInterval(interval);

    }, [products]);

    const nextSlide = () => {

        setCurrentIndex((prev) =>
            prev >= products.length - 1
                ? 0
                : prev + 1
        );

    };

    const prevSlide = () => {

        setCurrentIndex((prev) =>
            prev <= 0
                ? products.length - 1
                : prev - 1
        );

    };

    return (

        <div className="deal-section">

            <div className="deal-left">

                <span className="deal-badge">
                    Best Deal of the Day
                </span>

                <h2>
                    Trending Top Deals
                </h2>

                <p>
                    Discover unbeatable offers on
                    fashion and furniture,
                    handpicked daily.
                </p>

                <button
                    className="deal-btn"
                    onClick={() =>
                        navigate("/products")
                    }
                >
                    See all Products
                </button>

            </div>

            <div className="deal-right">

                <div className="carousel-container">

                    <button
                        className="carousel-arrow left-arrow"
                        onClick={prevSlide}
                    >
                        <FaChevronLeft />
                    </button>

                    <div className="carousel-wrapper">

                        <div
                            className="products-track"
                            style={{
                                transform: `translateX(-${currentIndex * 293}px)`
                            }}
                        >

                            {[...products, ...products].map(
                                (
                                    product,
                                    index
                                ) => (

                                    <div
                                        className="product-card"
                                        key={`${product.id}-${index}`}
                                    >

                                        <span className="discount-tag">

                                            {Math.round(
                                                product.discountPercentage
                                            )}% OFF

                                        </span>

                                        <img
                                            src={product.thumbnail}
                                            alt={product.title}
                                        />

                                        <h4>
                                            {product.title}
                                        </h4>

                                        <p className="brand">
                                            {product.brand}
                                        </p>

                                        <div className="product-price">
                                            ₹
                                            {product.price}

                                        </div>

                                        <div className="rating-row">

                                            <FaStar className="filled-star" />

                                            <span className="rating-value">
                                                {product.rating}
                                            </span>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                    <button
                        className="carousel-arrow right-arrow"
                        onClick={nextSlide}
                    >
                        <FaChevronRight />
                    </button>

                </div>

            </div>

        </div>

    );

}

export default CategorySection;