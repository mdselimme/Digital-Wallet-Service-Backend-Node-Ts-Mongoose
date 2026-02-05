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

// Update User 
router.patch("/update",
    validateSchemaRequest(updateUserZodSchema),
    checkAuthenticationUser(...Object.values(IUserRole)),
    UserController.updateAnUser
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

// Make User to Admin
router.patch("/role",
    validateSchemaRequest(updateRoleZodSchema),
    checkAuthenticationUser(IUserRole.Super_Admin),
    UserController.updateAnUserRole
);

// User suspend or suspend
router.patch("/status",
    validateSchemaRequest(updateRoleZodSchema),
    checkAuthenticationUser(IUserRole.Super_Admin, IUserRole.Admin),
    UserController.updateAnUserStatus
);

// Make User blocked and deleted
router.patch("/activity",
    validateSchemaRequest(updateRoleZodSchema),
    checkAuthenticationUser(...Object.values(IUserRole)),
    UserController.updateAnUserIsActive
);

// Get All Users 
router.get("/",
    checkAuthenticationUser(IUserRole.Admin, IUserRole.Super_Admin),
    UserController.getAllUsers
);


export const UserRouter = router;
