import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import Coin from "../models/CoinModel";

// const userDao = new UserDao();
const { BAD_REQUEST, CREATED, OK } = StatusCodes;

/**
 * Get list of all coins and their periods
 *
 * @param req
 * @param res
 * @returns
 */
export async function getCoinsPeriodList(req: Request, res: Response): Promise<any> {
  console.log("getting all coins");

  const coinsList = await Coin.find({}, { symbol : 1, period: 1 });

  console.log("retrieved:");
  console.log(coinsList);

  return res
    .status(OK)
    .json(coinsList);
}

/**
 * Get the coin data for one coin
 *
 * @param req
 * @param res
 * @returns
 */

export async function getCoinData(req: Request, res: Response): Promise<any> {
  const coin_name = req.params.coin;
  const coin_period = req.params.period;
  console.log("gettin coin data", coin_name, coin_period);

  const myCoin = await Coin.findOne({ symbol: coin_name, period: coin_period });

  if (myCoin == null){
    return res.status(BAD_REQUEST).json({ "Error": `coin/period combo { symbol: ${coin_name}, period: ${coin_period} } does not exist in db.`});
  }

  console.log("retrieved:");
  console.log(myCoin.symbol);
  console.log(myCoin.period);

  return res
    .status(OK)
    .json(myCoin);
}
