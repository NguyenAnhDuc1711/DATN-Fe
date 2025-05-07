import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register required modules with ChartJS
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const LineGraph = ({ labels, data }) => {
  const configData = {
    labels,
    datasets: [
      {
        label: "User active",
        data,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        // tension: 0.1, // Controls line smoothness
      },
    ],
  };

  const config = {
    type: "line",
    data: configData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        // title: {
        //   display: true,
        //   text: "",
        // },
      },
    },
  };

  return <Line data={config.data} options={config.options} />;
};

export default LineGraph;
