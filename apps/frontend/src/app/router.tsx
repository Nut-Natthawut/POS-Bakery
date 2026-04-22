import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "../pages/DashboardPage";
import { ProductsPage } from "../pages/ProductsPage";
import { SalesPage } from "../pages/SalesPage";
import { LoginPage } from "../pages/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { CategoriesPage } from "../pages/CategoriesPage";
import { OrderHistoryPage } from "../pages/OrderHistoryPage";
import { AppLayout } from "../layouts/AppLayout";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route index element={<Navigate to="/login" replace />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <ProductsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sales"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "STAFF"]}>
            <SalesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/categories"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <CategoriesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders/history"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "STAFF"]}>
            <OrderHistoryPage />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
};
