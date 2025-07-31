import { Router } from "express";
import { checkAuthenticationUser } from "../../middleware/checkAuthentication";
import { IUserRole } from "../users/user.interface";
import { TransactionController } from "./transaction.controller";
import { validateSchemaRequest } from "../../middleware/validateSchemaRequest";
import { transactionDataZodSchema } from "./transaction.validation";


const router = Router();

// Cash In User From agent 
router.post("/cash-in",
    validateSchemaRequest(transactionDataZodSchema),
    checkAuthenticationUser(IUserRole.Agent),
    TransactionController.cashInTransfer
);

// Send Money User From User 
router.post("/send-money",
    validateSchemaRequest(transactionDataZodSchema),
    checkAuthenticationUser(IUserRole.User),
    TransactionController.sendMoneyTransfer
);

// Cash Out User From Agent
router.post("/cash-out",
    validateSchemaRequest(transactionDataZodSchema),
    checkAuthenticationUser(IUserRole.User),
    TransactionController.userCashOutAgent
);

export const TransactionRouter = router;
