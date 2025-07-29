import express, { Request, Response } from "express";
import notFoundRoute from "./app/middleware/notFoundRoute";
const app = express();





// Default Route 
app.get("/", (req: Request, res: Response) => {
    res.json({
        version: "0.1",
        message: "Digital Wallet Server is running."
    })
});


// Not Found Route 
app.use(notFoundRoute);



export default app;