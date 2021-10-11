import StatusCodes from "http-status-codes";
import { Request, Response } from "express";

// import UserCoin from '@daos/User/UserDao.mock';
import { paramMissingError } from "@shared/constants";

// const userDao = new UserDao();
const { BAD_REQUEST, CREATED, OK } = StatusCodes;

// coinRouter.get('/', getCoinsPeriodList);
// coinRouter.get('/:coin/:period', getCoinData);

/**
 * Get list of all coins and their periods
 *
 * @param req
 * @param res
 * @returns
 */
export async function getCoinsPeriodList(req: Request, res: Response) {
  const response_obj = [
    {
      name: "BTC",
      period: "5m",
    },
    {
      name: "ETH",
      period: "5m",
    },
    {
      name: "ADA",
      period: "5m",
    },
  ];

  // mongodb.querty
  return res.status(OK).json(response_obj);
}

/**
 * Get the coin data for one coin
 *
 * @param req
 * @param res
 * @returns
 */

export async function getCoinData(req: Request, res: Response) {
  const coin_name = req.params.coin;
  const coin_period = req.params.period;
  console.log("gettin coin data", coin_name, coin_period);
  return res
    .status(OK)
    .json({ coin_name: coin_name, coin_period: coin_period });
}
