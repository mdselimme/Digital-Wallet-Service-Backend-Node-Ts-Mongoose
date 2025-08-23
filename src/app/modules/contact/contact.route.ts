import { Router } from "express";
import { validateSchemaRequest } from "../../middleware/validateSchemaRequest";
import { contactFormSchema } from "./contact.validation";
import { ContactController } from "./contact.controller";



const router = Router();

router.post("/send",
    validateSchemaRequest(contactFormSchema),
    ContactController.sendContactEmail
)

export const ContactRouter = router;