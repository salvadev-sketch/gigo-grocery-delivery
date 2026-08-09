import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminDeliveryPartners from "./pages/admin/AdminDeliveryPartners";

import DeliveryLayout from "./pages/delivery/DeliveryLayout";
import DeliveryLogin from "./pages/delivery/DeliveryLogin";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";

// TODO: customer-facing pages (Home, Login, ProductList, ProductDetails,
// Deals, Cart, Checkout, OrderTracking, Addresses, Search, My Orders)
// were not part of the asset zip — only their sub-components were
// (components/Checkout/*, components/OrderTracking/*). Build these pages
// around those components next.
function Home() {
  return (
    <div>
      <Navbar />
      <div className="p-10 text-center text-gray-500">
        Customer homepage — not yet built. See README for what's scaffolded so far.
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

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
  );
}
