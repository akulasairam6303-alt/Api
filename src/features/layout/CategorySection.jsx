import {
    useState,
    useEffect,
    useRef
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

    const carouselRef = useRef(null);

    const isPaused = useRef(false);

    const navigate = useNavigate();

    const [products, setProducts] =
        useState([]);

    useEffect(() => {

        fetch(
            `https://dummyjson.com/products/category/${activeCategory}`
        )
            .then(res => res.json())
            .then(data => {
                setProducts(data.products);
            });

    }, [activeCategory]);

    useEffect(() => {

        const carousel =
            carouselRef.current;

        if (
            !carousel ||
            products.length === 0
        ) return;

        let animationFrame;

        const speed = 0.8;

        const autoScroll = () => {

            if (!isPaused.current) {

                carousel.scrollLeft += speed;

                if (
                    carousel.scrollLeft >=
                    carousel.scrollWidth / 2
                ) {

                    carousel.scrollLeft = 0;
                }
            }

            animationFrame =
                requestAnimationFrame(
                    autoScroll
                );
        };

        animationFrame =
            requestAnimationFrame(
                autoScroll
            );

        return () =>
            cancelAnimationFrame(
                animationFrame
            );

    }, [products]);

    const scrollLeft = () => {

        carouselRef.current.scrollBy({
            left: -320,
            behavior: "smooth"
        });
    };

    const scrollRight = () => {

        carouselRef.current.scrollBy({
            left: 320,
            behavior: "smooth"
        });
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

                <div
                    className="products-carousel"
                    ref={carouselRef}
                    onMouseEnter={() => {
                        isPaused.current = true;
                    }}
                    onMouseLeave={() => {
                        isPaused.current = false;
                    }}
                    onTouchStart={() => {
                        isPaused.current = true;
                    }}
                    onTouchEnd={() => {
                        isPaused.current = false;
                    }}
                >

                    {[...products, ...products]
                        .map(
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
                                        $
                                        {product.price}
                                    </div>

                                    <div className="rating-row">

                                        {[...Array(5)]
                                            .map(
                                                (
                                                    _,
                                                    index
                                                ) => (

                                                    <FaStar
                                                        key={index}
                                                    />

                                                )
                                            )}

                                    </div>

                                </div>

                            )
                        )}

                </div>

                <div className="carousel-top">

                    <button
                        className="carousel-arrow left-arrow"
                        onClick={scrollLeft}
                    >
                        <FaChevronLeft />
                    </button>

                    <button
                        className="carousel-arrow right-arrow"
                        onClick={scrollRight}
                    >
                        <FaChevronRight />
                    </button>

                </div>

            </div>

        </div>
    );
}

export default CategorySection;