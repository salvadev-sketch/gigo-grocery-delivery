import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Deals from "./pages/Deals";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import MyOrders from "./pages/MyOrders";
import Addresses from "./pages/Addresses";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminDeliveryPartners from "./pages/admin/AdminDeliveryPartners";

import DeliveryLayout from "./pages/delivery/DeliveryLayout";
import DeliveryLogin from "./pages/delivery/DeliveryLogin";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";

function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <CartDrawer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<StorefrontLayout><Home /></StorefrontLayout>} />
          <Route path="/login" element={<StorefrontLayout><Login /></StorefrontLayout>} />
          <Route path="/products" element={<StorefrontLayout><ProductList /></StorefrontLayout>} />
          <Route path="/products/:id" element={<StorefrontLayout><ProductDetails /></StorefrontLayout>} />
          <Route path="/deals" element={<StorefrontLayout><Deals /></StorefrontLayout>} />
          <Route path="/checkout" element={<StorefrontLayout><Checkout /></StorefrontLayout>} />
          <Route path="/orders" element={<StorefrontLayout><MyOrders /></StorefrontLayout>} />
          <Route path="/orders/:id" element={<StorefrontLayout><OrderTracking /></StorefrontLayout>} />
          <Route path="/addresses" element={<StorefrontLayout><Addresses /></StorefrontLayout>} />

          <Route path="/delivery/login" element={<DeliveryLogin />} />
          <Route path="/delivery" element={<DeliveryLayout />}>
            <Route index element={<DeliveryDashboard />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="delivery-partners" element={<AdminDeliveryPartners />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}
