import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";
import ProtectedRoute from "../router/ProtectedRoute";

const LandingPage = lazy(() => import("../features/layout/LandingPage"));
const HomePage = lazy(() => import("../features/layout/HomePage"));
const CartPage = lazy(() => import("../features/cart/CartPage"));
const WishlistPage = lazy(() => import("../features/wishlist/WishlistPage"));
const AddressPage = lazy(() => import("../features/address/AddressPage"));
const ProductTable = lazy(() => import("../features/products/ProductTable"));
const AddAddressPage = lazy(() => import("../features/address/AddAddress"));
const PaymentPage = lazy(() => import("../features/payment/PaymentPage"));
const OrderConfirmationPage = lazy(() => import("../features/OrderConfirm/OrderConfirmPage"));
const OrdersPage = lazy(() => import("../features/OrderConfirm/OrdersPage"));

function AppRouter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PUBLIC PAGES */}
        <Route path="/products-table" element={<ProductTable />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />

        {/* PROTECTED */}
        <Route element={<ProtectedRoute />}>
          <Route path="/address" element={<AddressPage />} />
          <Route path="/add-address" element={<AddAddressPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Suspense>
  );
}

export default AppRouter;