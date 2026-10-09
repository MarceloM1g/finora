// src/layouts/PublicLayout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/public/Navbar";

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-white">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}
