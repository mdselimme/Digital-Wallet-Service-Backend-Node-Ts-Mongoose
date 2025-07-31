import { Router } from "express";
import { checkAuthenticationUser } from "../../middleware/checkAuthentication";
import { IUserRole } from "../users/user.interface";
import { WalletController } from "./wallet.controller";


const router = Router();

// get single wallet by id 
router.get("/:id",
    checkAuthenticationUser(...Object.values(IUserRole)),
    WalletController.getMySingleWallet
)




export const WalletRouter = router;