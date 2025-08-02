import { Router } from "express";
import { checkAuthenticationUser } from "../../middleware/checkAuthentication";
import { IUserRole } from "../users/user.interface";
import { WalletController } from "./wallet.controller";


const router = Router();

// Update Super Admin Wallet Balance 
router.patch("/add/super",
    checkAuthenticationUser(IUserRole.Super_Admin),
    WalletController.addMoneyToSuperAdminWallet
)

// get single wallet by id 
router.get("/:id",
    checkAuthenticationUser(...Object.values(IUserRole)),
    WalletController.getMySingleWallet
);

// Get All Wallet 
router.get("/",
    checkAuthenticationUser(IUserRole.Super_Admin, IUserRole.Admin),
    WalletController.getAllWalletData
);




export const WalletRouter = router;