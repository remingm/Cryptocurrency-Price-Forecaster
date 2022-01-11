import { useEffect, useState } from "react";
// import { Bell, Price } from "./model";
import { ICoin } from "../../models/CoinModel";
import api from "./api";
import Graph from "./Graph";

interface CoinDisplayComponentProps {
  coinId: string;
}
const CoinDisplayComponent = (props: CoinDisplayComponentProps) => {
  const coinId = props.coinId;
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
    <div className="relative  h-screen sm:px-10 max-w-6xl flex-col flex justify-between mx-auto">
      {!isLoaded && <div>Loading...</div>}
      {error && <div>{error}</div>}

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

export default CoinDisplayComponent;
