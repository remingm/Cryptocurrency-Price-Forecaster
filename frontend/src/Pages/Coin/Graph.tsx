import { InteractionMode } from "chart.js";
import { Line } from "react-chartjs-2";
import { Price } from "./model";

interface graphProps {
  pastPrices: Price[];
  predictionPrices: Price[];
}

const Graph = (props: graphProps) => {
  const past = getGraphablePrices(props.pastPrices);
  const prediction = getGraphablePrices(props.predictionPrices);

  addBridgePoint(past, prediction);

  const data = {
    datasets: [
      // past prices
      {
        label: "past",
        data: past,
        fill: true,
        backgroundColor: "rgb(55, 48, 163, .4)",
        borderColor: "rgba(55, 48, 163, 0.7)",
        tension: 0.4,
      },
      {
        // prediction prices
        label: "prediction",
        data: prediction,
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
    parsing: {
      xAxisKey: "timestamp",
      yAxisKey: "close",
    },
    scales: {
      y: {
        display: true,
      },
      x: {
        display: false,
      },
    },
  };
  return <Line data={data} options={options} />;
};

function getGraphablePrices(prices: Price[]): Price[] {
  return prices.map((price) => {
    return {
      timestamp: new Date(Number(price.timestamp)).toLocaleDateString("en-US"),
      close: price.close,
    };
  });
}

function addBridgePoint(firstArr: any[], secondArr: any[]): void {
  secondArr.unshift(firstArr[firstArr.length - 1]);
}

export default Graph;
