// src/layouts/DashboardLayout.tsx
import { Outlet } from "react-router-dom";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-white">
      <DashboardNavbar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}
