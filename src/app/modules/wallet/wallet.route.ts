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
    checkAuthenticationUser(IUserRole.Super_Admin, IUserRole.Admin),
    WalletController.getMySingleWallet
);

// Get All Wallet 
router.get("/",
    checkAuthenticationUser(IUserRole.Super_Admin, IUserRole.Admin),
    WalletController.getAllWalletData
);
// Get All Wallet 
router.get("/my-wallet",
    checkAuthenticationUser(IUserRole.Super_Admin, IUserRole.Admin),
    WalletController.getAllWalletData
);




export const WalletRouter = router;