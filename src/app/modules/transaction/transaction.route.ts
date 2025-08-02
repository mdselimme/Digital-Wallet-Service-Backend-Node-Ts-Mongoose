import { Router } from "express";
import { checkAuthenticationUser } from "../../middleware/checkAuthentication";
import { IUserRole } from "../users/user.interface";
import { TransactionController } from "./transaction.controller";
import { validateSchemaRequest } from "../../middleware/validateSchemaRequest";
import { transactionDataZodSchema } from "./transaction.validation";


const router = Router();


// Add money super admin to Other
router.post("/add-money",
    validateSchemaRequest(transactionDataZodSchema),
    checkAuthenticationUser(IUserRole.Admin, IUserRole.Super_Admin),
    TransactionController.addMoneyToAll
);


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

// Agent to agent b2b transaction
router.post("/b-to-b",
    validateSchemaRequest(transactionDataZodSchema),
    checkAuthenticationUser(IUserRole.Agent),
    TransactionController.agentToAgentB2b
);

// Get All Transactions 
router.get("/",
    checkAuthenticationUser(IUserRole.Admin, IUserRole.Super_Admin),
    TransactionController.getAllTransactionData
)

// Get A Single Transactions 
router.get("/:id",
    checkAuthenticationUser(...Object.values(IUserRole)),
    TransactionController.getASingleTransaction
);


export const TransactionRouter = router;
