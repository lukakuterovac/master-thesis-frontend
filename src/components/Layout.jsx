import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Header />
      <main className="min-h-full px-[calc(100vw-100%+16px)] sm:px-6 lg:px-8 py-4 sm:py-6 md:py-12 ">
        <Outlet />
      </main>
    </>
  );
}
