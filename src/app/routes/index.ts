import { Router } from "express";
import { UserRouter } from "../modules/users/user.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { TransactionRouter } from "../modules/transaction/transaction.route";
import { WalletRouter } from "../modules/wallet/wallet.route";
import { ContactRouter } from "../modules/contact/contact.route";
import { apiRateLimit } from "../config/rateLimiter";

export const router = Router();

//api rate limit
router.use(apiRateLimit)

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
    {
        path: "/wallet",
        route: WalletRouter
    },
    {
        path: "/contact",
        route: ContactRouter
    },
];

RoutesModel.forEach((route) => {
    router.use(route.path, route.route);
});