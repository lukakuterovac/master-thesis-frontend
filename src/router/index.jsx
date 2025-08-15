import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import PrivateRoute from "@/router/PrivateRoute";
import CreateForm from "@/pages/CreateForm";
import FillForm from "@/pages/FillForm";

function AppRouter() {
  return (
    <Routes>
      {/* Routes without layout */}
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/fill/:shareId" element={<FillForm />} />

      {/* Routes with layout */}
      <Route element={<Layout />}>
        {/* Public route */}
        <Route path="/" element={<Home />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreateForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/edit"
          element={
            <PrivateRoute>
              <CreateForm />
            </PrivateRoute>
          }
        />
        {/* Add more protected routes here */}
      </Route>
    </Routes>
  );
}

export default AppRouter;
