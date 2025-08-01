"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRouter = void 0;
const express_1 = require("express");
const checkAuthentication_1 = require("../../middleware/checkAuthentication");
const user_interface_1 = require("../users/user.interface");
const wallet_controller_1 = require("./wallet.controller");
const router = (0, express_1.Router)();
// get single wallet by id 
router.get("/:id", (0, checkAuthentication_1.checkAuthenticationUser)(...Object.values(user_interface_1.IUserRole)), wallet_controller_1.WalletController.getMySingleWallet);
exports.WalletRouter = router;
