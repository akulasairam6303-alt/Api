import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import MainLayout from "../features/layout/Mainlayout";
import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";
import ProtectedRoute from "../router/ProtectedRoute";

// Lazy pages
const HomePage = lazy(() => import("../features/layout/HomePage"));
const CartPage = lazy(() => import("../features/cart/CartPage"));
const WishlistPage = lazy(() => import("../features/wishlist/WishlistPage"));
const ProductTable = lazy(() => import("../features/products/ProductTable"));
const AddressPage = lazy(() => import("../features/cart/address/AddressPage"));

function AppRouter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>

            <Route index element={<HomePage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="products-table" element={<ProductTable />} />
            <Route path="address" element={<AddressPage />} />
            

          </Route>
        </Route>

      </Routes>
    </Suspense>
  );
}

export default AppRouter;