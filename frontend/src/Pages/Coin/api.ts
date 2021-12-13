import { Coin, sampleCoin, } from "./model";

const CoinApi = {
    getCoins: (): Coin[] => {
        const coins: Coin[] = [sampleCoin ]
        return coins
    },

    // get details for a single coin - ex "BTC"
    getCoin: (coinId: string): Promise<Coin> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => { resolve(sampleCoin) }
                , 250)
        })

    }
}

export default CoinApi