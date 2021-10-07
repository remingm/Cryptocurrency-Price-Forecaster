import { useParams } from "react-router"
import { Coin } from "./model"

const CoinDetail = (props: number) => {
    const { coinId } = useParams<{ coinId: string | undefined }>()
    console.log(coinId)
    console.log('hi')


    return (<div>coin {coinId} fdsafd</div>)
}

export default CoinDetail