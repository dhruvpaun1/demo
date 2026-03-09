import React from "react";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";
import {Doughnut} from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);
const ReactChart = ({title, data}) => {
	//   const options = {
	//     chart: {
	//       type: "pie",
	//       backgroundColor: "#1e293b"
	//     },
	//     title: {
	//       text: title,
	//       style: {
	//         color: "#f1f5f9",
	//         fontWeight: "bold"
	//       }
	//     },
	//     tooltip: {
	//       backgroundColor: "#0f172a",
	//       style: {
	//         color: "#e2e8f0"
	//       }
	//     },
	//     plotOptions: {
	//       pie: {
	//         allowPointSelect: true,
	//         cursor: "pointer",
	//         dataLabels: {
	//           enabled: true,
	//           style: {
	//             color: "#cbd5e1"
	//           }
	//         },
	//         showInLegend: true
	//       }
	//     },
	//     legend: {
	//       itemStyle: {
	//         color: "#cbd5e1"
	//       },
	//       itemHoverStyle: {
	//         color: "#ffffff"
	//       }
	//     },
	//     series: [
	//       {
	//         name: "Count",
	//         data: data
	//       }
	//     ]

	//   };
	const newData = {
		labels: data.map((dt) => dt.name),
		datasets: [
			{
				label: "No. of Status",
				data: data.map((dt) => dt.y),
				backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(255, 159, 64, 0.2)"],
				borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 159, 64, 1)"],
				borderWidth: 1,
			},
		],
	};
	const options = {
		responsive: true, // chart scales with container
		maintainAspectRatio: false, // allows custom container height/width
		plugins: {
			legend: {
				position: "bottom",
				labels: {
					color: "#cbd5e1", // legend text color
				},
			},
		},
	};
	return (
		<div style={{width: "100%", maxWidth: "400px", height: "300px", margin: "0 auto"}}>
			{title && <h3 className="text-white text-center mb-4">{title}</h3>}
			<Doughnut data={newData} options={options} />
		</div>
	);
};

export default React.memo(ReactChart);
