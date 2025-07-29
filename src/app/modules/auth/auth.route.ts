import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateSchemaRequest } from "../../middleware/validateSchemaRequest";
import { authLogInZodValidation } from "./auth.validation";


const router = Router();


router.post("/login",
    validateSchemaRequest(authLogInZodValidation),
    AuthController.AuthLogIn
);



export const AuthRouter = router;
