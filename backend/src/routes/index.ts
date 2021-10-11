import { Router } from "express";
import { createUser, login } from "./Users";
import { getCoinsPeriodList, getCoinData } from "./Coins";

// User-route
const userRouter = Router();
// userRouter.get('/all', getAllUsers);
// userRouter.post('/add', addOneUser);
// userRouter.put('/update', updateOneUser);
// userRouter.delete('/delete/:id', deleteOneUser);
userRouter.post("/", createUser);
userRouter.post("/login", login);

// Coin-route
const coinRouter = Router();
coinRouter.get("/", getCoinsPeriodList);
coinRouter.get("/:coin/:period", getCoinData);

// Export the base-router
const baseRouter = Router();
baseRouter.use("/users", userRouter);
baseRouter.use("/coins", coinRouter);
export default baseRouter;
