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
router.get("/",
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
    checkAuthenticationUser(...Object.values(IUserRole)),
    UserController.getSingleUser
)

// Update User 
router.patch("/:id",
    validateSchemaRequest(updateUserZodSchema),
    checkAuthenticationUser(...Object.values(IUserRole)),
    UserController.updateAnUser
);

// Make User to Agent
router.patch("/role",
    validateSchemaRequest(updateRoleZodSchema),
    checkAuthenticationUser(IUserRole.Super_Admin, IUserRole.Admin),
    UserController.updateAnUserRole
);

// Make User to Agent
router.patch("/status",
    validateSchemaRequest(updateRoleZodSchema),
    checkAuthenticationUser(IUserRole.Super_Admin, IUserRole.Admin),
    UserController.updateAnUserStatus
);

// Make User to Agent
router.patch("/active",
    validateSchemaRequest(updateRoleZodSchema),
    checkAuthenticationUser(...Object.values(IUserRole)),
    UserController.updateAnUserIsActive
);


export const UserRouter = router;
