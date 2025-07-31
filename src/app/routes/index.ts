import { Router } from "express";
import { UserRouter } from "../modules/users/user.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { TransactionRouter } from "../modules/transaction/transaction.route";

export const router = Router();

const RoutesModel = [
    {
        path: "/user",
        route: UserRouter
    },
    {
        path: "/auth",
        route: AuthRouter
    },
    {
        path: "/transaction",
        route: TransactionRouter
    },
];

RoutesModel.forEach((route) => {
    router.use(route.path, route.route);
});