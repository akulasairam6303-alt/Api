import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { lazy, Suspense } from "react";
import MainLayout from "../layout/Mainlayout";
import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";

const HomePage = lazy(() => import("../features/products/HomePage"));
const CartPage = lazy(() => import("../features/cart/CartPage"));
const WishlistPage = lazy(() => import("../features/wishlist/WishlistPage"));

function AppRouter() {
  const { user } = useSelector(state => state.auth);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          element={user ? <MainLayout /> : <Navigate to="/login" />}
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRouter;