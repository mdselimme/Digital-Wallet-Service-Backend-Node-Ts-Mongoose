import express, { Request, Response } from "express";
import notFoundRoute from "./app/middleware/notFoundRoute";
import { router } from "./app/routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
const app = express();
app.use(express.json());
app.use(cors({ origin: ["http://localhost:3000", "https://digital-wallet-management-system-cl.vercel.app"], credentials: true }));
app.use(cookieParser());




app.use("/api/v1/", router);



// Default Route 
app.get("/", (req: Request, res: Response) => {
    res.json({
        version: "0.08",
        message: "Digital Wallet Server is running."
    })
});


// Global Error Response 
app.use(globalErrorHandler);

// Not Found Route 
app.use(notFoundRoute);



export default app;