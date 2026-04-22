import { Router } from "express";
import { checkAdmin, checkAuth } from "../middleware/auth.middleware";
import { getDashboardSummary } from "../services/dashboard.service";

const dashboardRouter = Router();

// ดึงข้อมูลสรุป dashboard สำหรับ admin
dashboardRouter.get("/summary", checkAuth, checkAdmin, async (_req, res) => {
  try {
    const summary = await getDashboardSummary();

    return res.status(200).json({
      message: "Dashboard summary fetched successfully",
      data: summary
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch dashboard summary";

    return res.status(500).json({
      message
    });
  }
});

export default dashboardRouter;
