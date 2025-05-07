import { ArcElement, Chart } from "chart.js";
import { useEffect } from "react";
import { useAppSelector } from "../../../../hooks/redux";
import { AppState } from "../../../../store";

Chart.register(ArcElement);

const DoughnutGraph = ({ labels, data }: { labels: string[]; data: any }) => {
  const dateRange = useAppSelector(
    (state: AppState) => state.admin.overview.dateRange
  );
  const dataConfig = {
    labels: labels,
    datasets: [
      {
        label: "My First Dataset",
        data: data,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };
  const config: any = {
    type: "doughnut",
    data: dataConfig,
  };

  useEffect(() => {
    const canvasHtml: any = document.getElementById("doughnut-graph");
    const chart = new Chart(canvasHtml?.getContext("2d"), config);
    return () => {
      chart.destroy();
    };
  }, [dateRange]);

  return (
    <canvas
      id="doughnut-graph"
      width={"200px"}
      height={"200px"}
      style={{
        width: "300px !important",
        height: "300px !important",
      }}
    />
  );
};

export default DoughnutGraph;
