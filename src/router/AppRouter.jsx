import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";
import ProtectedRoute from "../router/ProtectedRoute";

const Home = lazy(() => import("../features/layout/HomePage"));
const Products = lazy(() => import("../features/products/ProductPage"));
const Cart = lazy(() => import("../features/cart/CartPage"));
const Wishlist = lazy(() => import("../features/wishlist/WishlistPage"));
const Address = lazy(() => import("../features/address/AddressPage"));
const ProductTable = lazy(() => import("../features/products/ProductTable"));
const AddAddress = lazy(() => import("../features/address/AddAddress"));
const Payment = lazy(() => import("../features/payment/PaymentPage"));
const OrderConfirm = lazy(() => import("../features/OrderConfirm/OrderConfirmPage"));
const Orders = lazy(() => import("../features/OrderConfirm/OrdersPage"));

function AppRouter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/address" element={<Address />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-confirmation" element={<OrderConfirm />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/products-table" element={<ProductTable />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Suspense>
  );
}

export default AppRouter;