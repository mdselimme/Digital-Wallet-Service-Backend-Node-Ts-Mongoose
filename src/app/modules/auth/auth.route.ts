import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateSchemaRequest } from "../../middleware/validateSchemaRequest";
import { authLogInZodValidation, resetPasswordZodValidation } from "./auth.validation";
import { checkAuthenticationUser } from "../../middleware/checkAuthentication";
import { IUserRole } from "../users/user.interface";


const router = Router();

// User Login Route 
router.post("/login",
    validateSchemaRequest(authLogInZodValidation),
    AuthController.AuthLogIn
);

// Reset User Password 
router.post("/reset-password",
    validateSchemaRequest(resetPasswordZodValidation),
    checkAuthenticationUser(...Object.values(IUserRole)),
    AuthController.resetUserPassword
);

// Refresh Token route 
router.post("/refresh-token", AuthController.getNewAccessTokenFromRefreshToken)

// User Logout Route 
router.post("/logout",
    AuthController.AuthLogOut
);



export const AuthRouter = router;
