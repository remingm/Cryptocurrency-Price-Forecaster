import mongoose, { Number, Schema } from "mongoose";


export interface ICoin extends Document {
    symbol: string,
    past: [{
        timestamp: string,
        close: number
    }],
    prediction: [{
        timestamp: string,
        close: number
    }],
    period: string,
    MAPE: number
}

const CoinSchema: Schema = new Schema({
    symbol: { type: String, required: true },
    past: [{
        timestamp: { type: String, required: true },
        close: { type: Number, required: true }
    }],
    prediction: [{
        timestamp: { type: String, required: true },
        close: { type: Number, required: true }
    }],
    period: { type: String, required: true },
    MAPE: { type: Number, required: true }
});

const Coin = mongoose.model<ICoin>("Coin", CoinSchema);
export default Coin;
