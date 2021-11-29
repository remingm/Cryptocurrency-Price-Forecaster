import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Coin, Bell, Prices } from "./model";
import api from "./api";
import Graph from "./Graph";

const CoinDetail = (props: string) => {
  const { coinId } = useParams<{ coinId: string }>();
  const [error, setError] = useState("");
  const [isLoaded, setLoaded] = useState(false);
  const [coin, setCoin] = useState<Coin>();
  const [needConvertedTime, setNeedConvertedTime] = useState(true);
  const [pastPrices, setPastPrices] = useState<Prices>({});
  const [predictionPrices, setPredictionPrices] = useState<Prices>();
  useEffect(() => {
    api.getCoin(coinId).then(
      (resp) => {
        setCoin(resp);
        setLoaded(true);
      },
      (error) => {
        setError(error);
        setLoaded(true);
      }
    );
  }, []);
  useEffect(() => {
    if (needConvertedTime) {
      if (coin != null) {
        setPastPrices(coin.pastPrices[Bell.CLOSE]);
        setPredictionPrices(coin.predictionPrices[Bell.CLOSE]);
      }
    }
  });
  useEffect(() => {
    if (needConvertedTime) {
      if (pastPrices != null) {
        for (const [key] of Object.entries(pastPrices)) {
          const date = new Date(parseInt(key) * 1000);
          const month = date.getMonth() + 1;
          const day = date.getDate();
          pastPrices[month + "/" + day] = pastPrices[key];
          delete pastPrices[key];
        }
      }
      if (predictionPrices != null) {
        for (const [key] of Object.entries(predictionPrices)) {
          const date = new Date(parseInt(key) * 1000);
          const month = date.getMonth() + 1;
          const day = date.getDate();
          predictionPrices[month + "/" + day] = predictionPrices[key];
          delete predictionPrices[key];
        }
        setNeedConvertedTime(false);
      }
    }
  });

  return (
    <div className="relative pt-20 h-screen sm:px-10 max-w-6xl flex-col flex justify-between mx-auto">
      {!isLoaded && <div>Loading...</div>}
      {error && <div>{error}</div>}

      <div className="flex-1">
        <p className=" text-3xl text-center">{coin?.name}</p>
      </div>

      <div className=" flex-grow">
        {needConvertedTime && <div>Loading...</div>}
        {!needConvertedTime && (
          <Graph
            pastPrices={pastPrices}
            predictionPrices={coin?.predictionPrices[Bell.CLOSE]}
          ></Graph>
        )}
      </div>
    </div>
  );
};

export default CoinDetail;
