import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Header />
      <main className="min-h-full py-12 px-[calc(100vw-100%+16px)] sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </>
  );
}
