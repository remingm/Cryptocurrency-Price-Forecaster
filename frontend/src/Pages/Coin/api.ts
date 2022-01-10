import { sampleCoin } from "./model";
import { ICoin } from "../../models/CoinModel";

const CoinApi = {
  getCoins: (): ICoin[] => {
    const coins: ICoin[] = [sampleCoin];
    return coins;
  },

  // get details for a single coin - ex "BTC"
  getCoin: (coinId: string): Promise<ICoin> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(sampleCoin);
      }, 250);
    });
  },
};

export default CoinApi;
