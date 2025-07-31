import { Router } from "express";
import { checkAuthenticationUser } from "../../middleware/checkAuthentication";
import { IUserRole } from "../users/user.interface";
import { TransactionController } from "./transaction.controller";


const router = Router();

// Cash In User From agent 
router.post("/cash-in",
    checkAuthenticationUser(IUserRole.Agent),
    TransactionController.cashInTransfer
);

// Send Money User From User 
router.post("/send-money",
    checkAuthenticationUser(IUserRole.User),
    TransactionController.sendMoneyTransfer
);

export const TransactionRouter = router;
