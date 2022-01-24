import { sampleCoin } from "./model";
import { ICoin } from "../../models/CoinModel";
import axios from "axios";

export const MockCoinApi = {
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

const LOCAL_URL = "http://localhost:3001";
const PROD_URL = "https://tgwi6k62ug.execute-api.us-west-2.amazonaws.com";

//TODO: switch to env vars to switch URL
const URL = PROD_URL;

export const CoinApi = {
  getCoin: (coinId: string): Promise<ICoin> =>
    axios
      .get<ICoin>(URL + `/api/v1/coins/${coinId}`)
      .then(function (response) {
        return response.data;
      })
      .catch(function (response) {
        throw new Error(response.status);
      }),
};
