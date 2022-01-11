import mongoose, { Number, Schema, Document } from "mongoose";

export interface Price {
  timestamp: string;
  close: number;
}

export interface ICoin {
  symbol: string;
  past: Array<Price>;
  prediction: Array<Price>;
  period: string;
  MAPE: number;
}

const CoinSchema: Schema = new Schema({
  symbol: { type: String, required: true },
  past: [
    {
      timestamp: { type: String, required: true },
      close: { type: Number, required: true },
    },
  ],
  prediction: [
    {
      timestamp: { type: String, required: true },
      close: { type: Number, required: true },
    },
  ],
  period: { type: String, required: true },
  MAPE: { type: Number, required: true },
});

const Coin = mongoose.model<ICoin>("ICoin", CoinSchema);
export default Coin;
