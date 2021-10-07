import { Coin } from "./model";

export const api = {
    getCoins: (): Coin[] => {
        let coins: Coin[] = [{ name: "BTC", price: 11000 }, { name: "ETH", price: 7.04 }]
        return coins
    },

    getCoin: (coinId: number): Coin => {
        return { name: "BTC", price: 0.44 }
    }
}