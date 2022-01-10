import { useEffect, useState } from "react";
import { useParams } from "react-router";
// import { Bell, Price } from "./model";
import { ICoin } from "../../models/CoinModel";
import api from "./api";
import Graph from "./Graph";

const CoinDetail = (props: string) => {
  const { coinId } = useParams<{ coinId: string }>();
  const [error, setError] = useState("");
  const [isLoaded, setLoaded] = useState(false);
  const [coin, setCoin] = useState<ICoin>();

  useEffect(() => {
    api.getCoin(coinId).then(
      (someCoin) => {
        setCoin(someCoin);
        setLoaded(true);
      },
      (error) => {
        setError(error);
        setLoaded(true);
      }
    );
  }, []);

  return (
    <div className="relative pt-20 h-screen sm:px-10 max-w-6xl flex-col flex justify-between mx-auto">
      {!isLoaded && <div>Loading...</div>}
      {error && <div>{error}</div>}

      <div className="flex-1">
        <p className=" text-3xl text-center">{coin?.symbol}</p>
      </div>

      <div className=" flex-grow">
        {coin === undefined && <div>Loading...</div>}
        {coin !== undefined && (
          <Graph
            pastPrices={coin.past}
            predictionPrices={coin.prediction}
          ></Graph>
        )}
      </div>
    </div>
  );
};

export default CoinDetail;
