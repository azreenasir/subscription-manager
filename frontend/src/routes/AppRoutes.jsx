import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar";
import AddSubscription from "../pages/AddSubscription";
import Dashboard from "../pages/Dashboard";
import EditSubscription from "../pages/EditSubscription";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Subscriptions from "../pages/Subscriptions";

const isLoggedIn = () => {
  return Boolean(localStorage.getItem("token"));
};

function ProtectedLayout() {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <main className="page">
        <Outlet />
      </main>
    </>
  );
}

function PublicOnly({ children }) {
  if (isLoggedIn()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isLoggedIn() ? "/dashboard" : "/login"} replace />}
      />
      <Route
        path="/login"
        element={
          <PublicOnly>
            <Login />
          </PublicOnly>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnly>
            <Register />
          </PublicOnly>
        }
      />

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/subscriptions/add" element={<AddSubscription />} />
        <Route path="/subscriptions/edit/:id" element={<EditSubscription />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
