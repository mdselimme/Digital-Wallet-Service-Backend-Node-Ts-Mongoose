import httpStatusCodes from 'http-status-codes';
import { Request, Response } from "express"
import { catchAsyncTryCatchHandler } from "../../utils/catchAsyncTryCatch"
import { sendEmail } from "../../utils/sendEmail"
import { sendResponse } from "../../utils/sendResponse";
import { envData } from '../../config/envVariable';

const sendContactEmail = catchAsyncTryCatchHandler(async (req: Request, res: Response) => {

    const { name, email, phone, subject, message } = req.body;


    await sendEmail({
        to: envData.SMTP.SMTP_USER,
        subject: subject,
        templateName: "contactForm",
        templateData: {
            name, email, phone, subject, message
        }
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCodes.OK,
        data: null,
        message: "Contact Form Submitted Successfully."
    });
});


export const ContactController = { sendContactEmail }