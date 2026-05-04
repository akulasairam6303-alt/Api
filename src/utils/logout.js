export const logout = (dispatch, navigate) => {
    dispatch?.({ type: "cart/clearCart" });
    dispatch?.({ type: "wishlist/clearWishlist" });

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");

    navigate("/login");
};