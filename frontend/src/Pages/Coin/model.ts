import Coin from "../../../../ts_lib/models/CoinModel";

export interface Price {
  timestamp: string;
  close: number;
}

export const sampleCoin: typeof Coin = {
  name: "Bitcoin",
  ticker: "BTC",
  period: "1hr",
  past: [
    {
      timestamp: "1638748800000",
      close: 475.66,
    },
    {
      timestamp: "1638835200000",
      close: 474.29,
    },
    {
      timestamp: "1638921600000",
      close: 480.12,
    },
  ],
  prediction: [
    {
      timestamp: "1639094400000",
      close: 466.08,
    },
    {
      timestamp: "1639180800000",
      close: 466.97,
    },
    {
      timestamp: "1639267200000",
      close: 448.7,
    },
  ],
};
