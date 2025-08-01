"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRouter = void 0;
const express_1 = require("express");
const checkAuthentication_1 = require("../../middleware/checkAuthentication");
const user_interface_1 = require("../users/user.interface");
const transaction_controller_1 = require("./transaction.controller");
const validateSchemaRequest_1 = require("../../middleware/validateSchemaRequest");
const transaction_validation_1 = require("./transaction.validation");
const router = (0, express_1.Router)();
// Cash In User From agent 
router.post("/cash-in", (0, validateSchemaRequest_1.validateSchemaRequest)(transaction_validation_1.transactionDataZodSchema), (0, checkAuthentication_1.checkAuthenticationUser)(user_interface_1.IUserRole.Agent), transaction_controller_1.TransactionController.cashInTransfer);
// Cash In User From agent 
router.post("/add-money", (0, validateSchemaRequest_1.validateSchemaRequest)(transaction_validation_1.transactionDataZodSchema), (0, checkAuthentication_1.checkAuthenticationUser)(user_interface_1.IUserRole.Admin, user_interface_1.IUserRole.Super_Admin), transaction_controller_1.TransactionController.addMoneyToAgent);
// Send Money User From User 
router.post("/send-money", (0, validateSchemaRequest_1.validateSchemaRequest)(transaction_validation_1.transactionDataZodSchema), (0, checkAuthentication_1.checkAuthenticationUser)(user_interface_1.IUserRole.User), transaction_controller_1.TransactionController.sendMoneyTransfer);
// Cash Out User From Agent
router.post("/cash-out", (0, validateSchemaRequest_1.validateSchemaRequest)(transaction_validation_1.transactionDataZodSchema), (0, checkAuthentication_1.checkAuthenticationUser)(user_interface_1.IUserRole.User), transaction_controller_1.TransactionController.userCashOutAgent);
// Agent to agent b2b transaction
router.post("/b-to-b", (0, validateSchemaRequest_1.validateSchemaRequest)(transaction_validation_1.transactionDataZodSchema), (0, checkAuthentication_1.checkAuthenticationUser)(user_interface_1.IUserRole.Agent), transaction_controller_1.TransactionController.agentToAgentB2b);
// Get All Transactions 
router.get("/get-all", (0, checkAuthentication_1.checkAuthenticationUser)(user_interface_1.IUserRole.Admin, user_interface_1.IUserRole.Super_Admin), transaction_controller_1.TransactionController.getAllTransactionData);
// Get A Single Transactions 
router.get("/:id", (0, checkAuthentication_1.checkAuthenticationUser)(...Object.values(user_interface_1.IUserRole)), transaction_controller_1.TransactionController.getASingleTransaction);
exports.TransactionRouter = router;
