import { getDashboardOverview } from "./dashboard.service.js";

export const getDashboard = async (req, res) => {
  try {
    const dashboard = await getDashboardOverview();

    return res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
