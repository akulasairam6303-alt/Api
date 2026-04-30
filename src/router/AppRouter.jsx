import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import MainLayout from "../features/layout/Mainlayout";
import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";
import MainPage from "../features/MainPage/Mainpage";
import ProtectedRoute from "../router/ProtectedRoute";

const CartPage = lazy(() => import("../features/cart/CartPage"));
const WishlistPage = lazy(() => import("../features/wishlist/WishlistPage"));
const ProductTable = lazy(() => import("../features/products/ProductTable"));
const AddressPage = lazy(() => import("../features/address/AddressPage"));
const AddAddressPage = lazy(() => import("../features/address/AddAddress"));
const PaymentPage = lazy(() => import("../features/Payment/PaymentPage")); 
const OrderConfirmPage = lazy(() => import("../features/OrderConfirm/OrderConfirmPage"));
const OrdersPage = lazy(() => import("../features/OrderConfirm/OrdersPage"));

function AppRouter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

            {/* THIS is your landing page now */}
            <Route path="/" element={<MainPage />} />

            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/products-table" element={<ProductTable />} />
            <Route path="/address" element={<AddressPage />} />
            <Route path="/add-address" element={<AddAddressPage />} />
            <Route path="/add-address/:id" element={<AddAddressPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/order-confirm" element={<OrderConfirmPage />} />
            <Route path="/orders" element={<OrdersPage />} />

          </Route>
        </Route>

      </Routes>
    </Suspense>
  );
}

export default AppRouter;