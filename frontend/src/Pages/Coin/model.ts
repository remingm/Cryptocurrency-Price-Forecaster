export interface Prices {
    [key: string]: number;
}

export interface Coin {
    name: string,
    ticker: string,
    period: string,
    pastPrices: { [key: string]: Prices },
    predictionPrices: { [key: string]: Prices }
    MAPE?: number

}

export enum Bell {
    CLOSE = "close"
}


export const sampleCoin: Coin = {
    name: "Bitcoin",
    ticker: "BTC",
    period: "1hr",
    pastPrices: {
        "close": {
            "1636249622": 3549.58,
            "1636336022": 3554.7,
            "1636422422": 3558.1,
            "1636508822": 3547.79,
            "1636595222": 3522.21,
            "1636681622": 3527.66,
            "1636768022": 3533.44,
            "1636854422": 3513.87,
            "1636940822": 3456.59,
            "1637027222": 3467.77,
            "1637113622": 3415.68,
            "1637200022": 3443.27,
            "1637286422": 3456.98
        }
    },
    predictionPrices: {
        "close": {
            "1637286422": 3456.98,
            "1637459222": 3515.58,
            "1637545622": 3476.88,
            "1637632022": 3492.24,
            "1637718422": 3473.95,
            "1637804822": 3511.97,
            "1637891222": 3506.59,
            "1637977622": 3517.43,
            "1638064022": 3507.28,
            "1638150422": 3500.86,
        }
    }
}
