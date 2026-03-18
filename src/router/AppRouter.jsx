import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import MainLayout from "../features/layout/Mainlayout";
import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";
import ProtectedRoute from "../router/ProtectedRoute";

const HomePage = lazy(() => import("../features/layout/HomePage"));
const CartPage = lazy(() => import("../features/cart/CartPage"));
const WishlistPage = lazy(() => import("../features/wishlist/WishlistPage"));
const ProductTable = lazy(() => import("../features/products/ProductTable")); // ✅ added

function AppRouter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>

            <Route index element={<HomePage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="products-table" element={<ProductTable />} /> {/* ✅ added */}

          </Route>
        </Route>

      </Routes>
    </Suspense>
  );
}

export default AppRouter;