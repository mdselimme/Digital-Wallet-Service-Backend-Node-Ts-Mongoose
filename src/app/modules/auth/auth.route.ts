import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateSchemaRequest } from "../../middleware/validateSchemaRequest";
import { authLogInZodValidation } from "./auth.validation";


const router = Router();

// User Login Route 
router.post("/login",
    validateSchemaRequest(authLogInZodValidation),
    AuthController.AuthLogIn
);

// User Logout Route 
router.post("/logout",
    AuthController.AuthLogOut
);



export const AuthRouter = router;
