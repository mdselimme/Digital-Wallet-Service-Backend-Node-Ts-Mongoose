"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRouter = void 0;
const express_1 = require("express");
const checkAuthentication_1 = require("../../middleware/checkAuthentication");
const user_interface_1 = require("../users/user.interface");
const wallet_controller_1 = require("./wallet.controller");
const router = (0, express_1.Router)();
// Update Super Admin Wallet Balance 
router.patch("/add/super", (0, checkAuthentication_1.checkAuthenticationUser)(user_interface_1.IUserRole.Super_Admin), wallet_controller_1.WalletController.addMoneyToSuperAdminWallet);
// get single wallet by id 
router.get("/find/:id", (0, checkAuthentication_1.checkAuthenticationUser)(user_interface_1.IUserRole.Super_Admin, user_interface_1.IUserRole.Admin), wallet_controller_1.WalletController.getSingleWallet);
// Get All Wallet 
router.get("/", (0, checkAuthentication_1.checkAuthenticationUser)(user_interface_1.IUserRole.Super_Admin, user_interface_1.IUserRole.Admin), wallet_controller_1.WalletController.getAllWalletData);
// Get All Wallet 
router.get("/me", (0, checkAuthentication_1.checkAuthenticationUser)(...Object.values(user_interface_1.IUserRole)), wallet_controller_1.WalletController.getMyWallet);
exports.WalletRouter = router;
