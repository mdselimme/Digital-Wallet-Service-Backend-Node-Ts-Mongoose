"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validateSchemaRequest_1 = require("../../middleware/validateSchemaRequest");
const auth_validation_1 = require("./auth.validation");
const checkAuthentication_1 = require("../../middleware/checkAuthentication");
const user_interface_1 = require("../users/user.interface");
const router = (0, express_1.Router)();
// User Login Route 
router.post("/login", (0, validateSchemaRequest_1.validateSchemaRequest)(auth_validation_1.authLogInZodValidation), auth_controller_1.AuthController.AuthLogIn);
// Reset User Password 
router.post("/reset-password", (0, validateSchemaRequest_1.validateSchemaRequest)(auth_validation_1.resetPasswordZodValidation), (0, checkAuthentication_1.checkAuthenticationUser)(...Object.values(user_interface_1.IUserRole)), auth_controller_1.AuthController.resetUserPassword);
// Refresh Token route 
router.post("/refresh-token", auth_controller_1.AuthController.getNewAccessTokenFromRefreshToken);
// User Logout Route 
router.post("/logout", auth_controller_1.AuthController.AuthLogOut);
exports.AuthRouter = router;
