import { useEffect, useState } from "react";
// import { Bell, Price } from "./model";
import { ICoin } from "../../models/CoinModel";
import { CoinApi, MockCoinApi } from "./api";
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
    CoinApi.getCoin(coinId).then(
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
    <div className="relative  h-screen sm:px-10 max-w-6xl flex-col flex justify-between mx-auto my-24">
      {!isLoaded && <div>Loading...</div>}
      {error && <div>{error}</div>}

      {coinId}
      <div className=" flex-grow">
        {coin === undefined && <div>Loading...</div>}
        {coin !== undefined && (
          <Graph
            pastPrices={coin.past.slice(coin.prediction.length * -2)} // trim to make graph 2/3 past 1/3 prediction
            predictionPrices={coin.prediction}
          ></Graph>
        )}
      </div>
    </div>
  );
};

export default CoinDisplayComponent;
