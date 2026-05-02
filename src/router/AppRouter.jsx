import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import MainLayout from "../features/layout/Mainlayout";
import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";
import ProtectedRoute from "../router/ProtectedRoute";

const LandingPage = lazy(() => import("../features/layout/LandingPage"));
const HomePage = lazy(() => import("../features/layout/HomePage"));
const CartPage = lazy(() => import("../features/cart/CartPage"));
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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* REDIRECTS (legacy paths support) */}
        <Route path="/cart" element={<Navigate to="/app/cart" replace />} />
        <Route path="/address" element={<Navigate to="/app/address" replace />} />
        <Route path="/add-address" element={<Navigate to="/app/add-address" replace />} />
        <Route path="/payment" element={<Navigate to="/app/payment" replace />} />
        <Route path="/order-confirmation" element={<Navigate to="/app/order-confirmation" replace />} />
        <Route path="/orders" element={<Navigate to="/app/orders" replace />} />
        <Route path="/products-table" element={<Navigate to="/app/products-table" replace />} />

        {/* MAIN APP */}
        <Route path="/app" element={<MainLayout />}>

          {/* PUBLIC INSIDE APP */}
          <Route index element={<HomePage />} />
          <Route path="products-table" element={<ProductTable />} />
          <Route path="cart" element={<CartPage />} />

          {/* PROTECTED FLOW */}
          <Route element={<ProtectedRoute />}>
            <Route path="address" element={<AddressPage />} />
            <Route path="add-address" element={<AddAddressPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="orders" element={<OrdersPage />} />
          </Route>

        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Suspense>
  );
}

export default AppRouter;