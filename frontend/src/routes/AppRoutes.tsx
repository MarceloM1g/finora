import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";

import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import { ProtectedRoute } from "../components/ProtectedRoute";
import Payments from "../pages/payments/Payments";
import Services from "../pages/services/Services";
import CreateService from "../pages/services/CreateService";
import CreatePayment from "../pages/payments/CreatePayment";
import Clients from "../pages/clients/Clients";
import CreateClient from "../pages/clients/CreateClient";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/payments/create" element={<CreatePayment />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/create" element={<CreateService />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/create" element={<CreateClient />} />
        </Route>
      </Route>
    </Routes>
  );
}
