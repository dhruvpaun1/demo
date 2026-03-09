import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function CustomerDataChart({ res }) {
  const [categories, setCategories] = useState([]);
  const [seriesData, setSeriesData] = useState([]);

  useEffect(() => {
    if (res?.data?.success) {
      const result = res.data.results;
      setCategories(result.map((item) => item.month));
      setSeriesData(result.map((item) => Number(item.total)));
    }
  }, [res]);

  const labels = categories;

  const data = {
    labels,
    datasets: [
      {
        label: "New Users",
        data: seriesData,
        borderColor: "rgba(56, 189, 248, 1)", // sky-400
        backgroundColor: "rgba(56, 189, 248, 0.2)",
        tension: 0.4, // smooth curves
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: "rgba(6, 182, 212, 1)", // cyan-500
        fill: true, // area under line
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#cbd5e1", // light text for dark bg
        },
      },
      title: {
        display: true,
        text: "Customer Growth (Last 6 Months)",
        color: "#f1f5f9",
        font: {
          size: 18,
          weight: "bold",
        },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#ffffff",
        bodyColor: "#e2e8f0",
      },
    },
    scales: {
      x: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "#334155" },
      },
      y: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "#334155" },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "350px" }}>
      <Line options={options} data={data} />
    </div>
  );
}

export default CustomerDataChart;
