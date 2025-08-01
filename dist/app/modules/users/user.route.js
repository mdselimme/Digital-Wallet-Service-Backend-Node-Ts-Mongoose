"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateSchemaRequest_1 = require("../../middleware/validateSchemaRequest");
const user_validation_1 = require("./user.validation");
const checkAuthentication_1 = require("../../middleware/checkAuthentication");
const user_interface_1 = require("./user.interface");
const router = (0, express_1.Router)();
// User Register 
router.post("/register", (0, validateSchemaRequest_1.validateSchemaRequest)(user_validation_1.createUserZodSchema), user_controller_1.UserController.createAnUser);
// Get All Users 
router.get("/", (0, checkAuthentication_1.checkAuthenticationUser)(user_interface_1.IUserRole.Admin, user_interface_1.IUserRole.Super_Admin), user_controller_1.UserController.getAllUsers);
// Get All Users 
router.get("/me", (0, checkAuthentication_1.checkAuthenticationUser)(...Object.values(user_interface_1.IUserRole)), user_controller_1.UserController.getMeUser);
// Get Single User 
router.get("/:userId", (0, checkAuthentication_1.checkAuthenticationUser)(...Object.values(user_interface_1.IUserRole)), user_controller_1.UserController.getSingleUser);
// Update User 
router.patch("/update/:id", (0, validateSchemaRequest_1.validateSchemaRequest)(user_validation_1.updateUserZodSchema), (0, checkAuthentication_1.checkAuthenticationUser)(...Object.values(user_interface_1.IUserRole)), user_controller_1.UserController.updateAnUser);
// Make User to Agent
router.patch("/update-role/:id", (0, validateSchemaRequest_1.validateSchemaRequest)(user_validation_1.updateRoleZodSchema), (0, checkAuthentication_1.checkAuthenticationUser)(user_interface_1.IUserRole.Super_Admin), user_controller_1.UserController.updateAnUserRole);
exports.UserRouter = router;
