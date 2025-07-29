import { Router } from "express";
import { UserController } from "./user.controller";
import { validateSchemaRequest } from "../../middleware/validateSchemaRequest";
import { createUserZodSchema } from "./user.validation";

const router = Router();


router.post("/create", validateSchemaRequest(createUserZodSchema), UserController.createAnUser);



export const UserRouter = router;
