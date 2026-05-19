import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

import DashboardPanel from "../common/DashboardPanel";

const buildBusinessOverviewConfig = (data) => ({
  type: "bar",
  data: {
    labels: data.labels,
    datasets: [
      {
        label: "Revenue ($K)",
        data: data.revenue,
        borderColor: "#1f7a35",
        backgroundColor: "rgba(31, 122, 53, 0.18)",
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
        categoryPercentage: 0.72,
        barPercentage: 0.72,
        maxBarThickness: 32,
        yAxisID: "value",
      },
      {
        label: "Margin ($K)",
        data: data.margin,
        type: "line",
        borderColor: "#c9a84c",
        backgroundColor: "rgba(201, 168, 76, 0.08)",
        borderWidth: 2,
        pointBackgroundColor: "#c9a84c",
        pointBorderWidth: 0,
        pointRadius: 4,
        pointHoverRadius: 4,
        tension: 0.4,
        fill: true,
        yAxisID: "value",
      },
      {
        label: "Orders",
        data: data.orders,
        type: "line",
        borderColor: "#3b82f6",
        backgroundColor: "transparent",
        borderWidth: 2,
        pointBackgroundColor: "#3b82f6",
        pointBorderWidth: 0,
        pointRadius: 3,
        pointHoverRadius: 4,
        tension: 0.4,
        fill: false,
        yAxisID: "orders",
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      legend: {
        align: "center",
        position: "top",
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          color: "#6c757d",
          font: {
            family: "Poppins",
            size: 10,
          },
          padding: 10,
        },
      },
      tooltip: {
        backgroundColor: "#0d2b1a",
        boxPadding: 4,
        padding: 10,
        titleFont: {
          family: "Poppins",
          size: 12,
          weight: 700,
        },
        bodyFont: {
          family: "Poppins",
          size: 12,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6c757d",
          font: {
            family: "Poppins",
            size: 10,
          },
        },
      },
      value: {
        beginAtZero: true,
        position: "left",
        grid: {
          color: "rgba(226, 230, 234, 0.8)",
        },
        ticks: {
          color: "#6c757d",
          maxTicksLimit: 5,
          callback: (value) => `$${(value / 1000).toFixed(0)}K`,
          font: {
            family: "Poppins",
            size: 10,
          },
        },
      },
      orders: {
        beginAtZero: true,
        max: 20,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: "#3b82f6",
          maxTicksLimit: 5,
          font: {
            family: "Poppins",
            size: 10,
          },
        },
      },
    },
  },
});

const BusinessOverviewChart = ({ data }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data) {
      return undefined;
    }

    chartRef.current?.destroy();
    chartRef.current = new Chart(
      canvasRef.current,
      buildBusinessOverviewConfig(data),
    );

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [data]);

  if (!data) {
    return null;
  }

  return (
    <DashboardPanel
      title="Business Overview - Last 7 Months"
      titleIcon="bi-graph-up-arrow"
      actionText="Full report"
      actionLink="/dashboard/reports"
    >
      <div className="dashboard-chart-shell">
        <canvas ref={canvasRef} aria-label="Business overview chart" />
      </div>
    </DashboardPanel>
  );
};

export default BusinessOverviewChart;
