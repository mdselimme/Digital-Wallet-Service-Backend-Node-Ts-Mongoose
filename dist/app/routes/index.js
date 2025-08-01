"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/users/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const transaction_route_1 = require("../modules/transaction/transaction.route");
const wallet_route_1 = require("../modules/wallet/wallet.route");
exports.router = (0, express_1.Router)();
const RoutesModel = [
    {
        path: "/user",
        route: user_route_1.UserRouter
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRouter
    },
    {
        path: "/transaction",
        route: transaction_route_1.TransactionRouter
    },
    {
        path: "/wallet",
        route: wallet_route_1.WalletRouter
    },
];
RoutesModel.forEach((route) => {
    exports.router.use(route.path, route.route);
});
