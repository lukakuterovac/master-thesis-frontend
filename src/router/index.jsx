import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import PrivateRoute from "@/router/PrivateRoute";

import {
  Home,
  SignIn,
  SignUp,
  Dashboard,
  CreateForm,
  FillForm,
  Explore,
} from "@/pages";

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
        <Route path="/explore" element={<Explore />} />

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
          path="/edit/:id"
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
