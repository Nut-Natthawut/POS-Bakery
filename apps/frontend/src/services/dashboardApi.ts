import type { DashboardSummaryResponse } from "../types/dashboard";
import { apiClient } from "./apiClient";

// ดึงข้อมูล dashboard summary จาก backend
export const getDashboardSummary = async () => {
    return await apiClient<DashboardSummaryResponse>("/dashboard/summary");
}