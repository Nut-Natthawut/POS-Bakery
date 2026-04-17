import { Navigate, Route, Routes } from "react-router-dom"
import { DashboardPage } from "../pages/DashboardPage"
import { ProductsPage } from "../pages/ProductsPage"
import { SalesPage } from "../pages/SalesPage"
import { LoginPage } from "../pages/LoginPage"


export const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route index element={<Navigate to="/login" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/sales" element={<SalesPage />} />
        </Routes>
    )
}