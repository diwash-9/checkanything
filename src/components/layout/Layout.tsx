import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-gray-900">
      <Header />
      <main className="flex-1 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
