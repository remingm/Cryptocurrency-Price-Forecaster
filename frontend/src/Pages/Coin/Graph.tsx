import { InteractionMode } from "chart.js";
import { useEffect } from "react";
import { Line } from "react-chartjs-2";
const Graph = (props: any) => {
  const data = {
    datasets: [
      // past prices
      {
        label: "past",
        data: props.pastPrices,
        fill: true,
        backgroundColor: "rgb(55, 48, 163, .4)",
        borderColor: "rgba(55, 48, 163, 0.7)",
        tension: 0.4,
      },
      {
        // prediction prices
        label: "prediction",
        data: props.predictionPrices,
        fill: true,
        borderDash: [5, 5],
        tension: 0.4,
        backgroundColor: "rgb(55, 48, 163, .1)",
        borderColor: "rgba(55, 48, 163, 0.3)",
      },
    ],
  };
  const options = {
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "nearest" as InteractionMode,
    },
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        display: false,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default Graph;
