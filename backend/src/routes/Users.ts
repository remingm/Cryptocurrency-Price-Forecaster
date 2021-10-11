import StatusCodes from "http-status-codes";
import { Request, Response } from "express";

// import UserDao from '@daos/User/UserDao.mock';
import { paramMissingError } from "@shared/constants";

// const userDao = new UserDao();
const { BAD_REQUEST, CREATED, OK } = StatusCodes;

/**
 * Get all users. #TODO: test to see if this works at all
 *
 * @param req
 * @param res
 * @returns
 */
export async function createUser(req: Request, res: Response) {
  const email = req.body.email;
  const password = req.body.pswd;

  const resp_obj = {
    user: email,
    auth_token: "ThisIsYourAuthToken",
  };

  return res.status(OK).json(resp_obj);
}

/**
 * Get all users. #TODO: test to see if this works at all
 *
 * @param req
 * @param res
 * @returns
 */
export async function login(req: Request, res: Response) {
  const email = req.body.email;
  const password = req.body.pswd;

  if (email === "good@email.com" && password === "good") {
    return res.status(OK).json({ auth_token: "ThisIsYourAuthToken" });
  }
  return res.status(401);
}
