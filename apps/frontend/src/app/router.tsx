import { Navigate, Route, Routes } from "react-router-dom"
import { DashboardPage } from "../pages/DashboardPage"
import { ProductsPage } from "../pages/ProductsPage"
import { SalesPage } from "../pages/SalesPage"


export const AppRouter = () => {
    return (
        <Routes>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/sales" element={<SalesPage />} />
        </Routes>
    )
}