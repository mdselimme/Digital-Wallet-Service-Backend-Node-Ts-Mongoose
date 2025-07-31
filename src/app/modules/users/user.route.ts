import { Router } from "express";
import { UserController } from "./user.controller";
import { validateSchemaRequest } from "../../middleware/validateSchemaRequest";
import { createUserZodSchema, updateRoleZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuthenticationUser } from "../../middleware/checkAuthentication";
import { IUserRole } from "./user.interface";


const router = Router();

// User Register 
router.post("/register",
    validateSchemaRequest(createUserZodSchema),
    UserController.createAnUser);

// Get All Users 
router.get("/all-users",
    checkAuthenticationUser(IUserRole.Admin, IUserRole.Super_Admin),
    UserController.getAllUsers
);

// Get All Users 
router.get("/me",
    checkAuthenticationUser(...Object.values(IUserRole)),
    UserController.getMeUser
)

// Get Single User 
router.get("/:userId",
    checkAuthenticationUser(IUserRole.Admin, IUserRole.Super_Admin),
    UserController.getSingleUser
)

// Update User 
router.patch("/update/:id",
    validateSchemaRequest(updateUserZodSchema),
    checkAuthenticationUser(...Object.values(IUserRole)),
    UserController.updateAnUser
);

// Make User to Agent
router.patch("/update-role/:id",
    validateSchemaRequest(updateRoleZodSchema),
    checkAuthenticationUser(IUserRole.Super_Admin),
    UserController.updateAnUserRole
);


export const UserRouter = router;
