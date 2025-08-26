import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-12">
        <Outlet />
      </main>
    </div>
  );
}
