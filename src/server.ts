import { Server } from "http";
import app from "./app";
import { envData } from "./app/config/envVariable";
import mongoose from "mongoose";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";


let server: Server;


// Configure server and database connected 
const serverStart = async () => {
    try {
        const mongodbUrl: string = envData.MONGODB_CONFIG_URL;
        await mongoose.connect(mongodbUrl);
        console.log(`Mongodb database connected.`);
        server = app.listen(envData.PORT, () => {
            console.log(`Server is running: http://localhost:${envData.PORT}`);
        });
    } catch (error) {
        if (error instanceof Error) {
            console.log(`Server Error : ${error.message}`)
        }
    }
};


(async () => {
    await serverStart();
    await seedSuperAdmin();
})();

// Sigterm error 
process.on("SIGTERM", () => {
    console.log("Sigterm error received. Server is close.");
    if (server) {
        server.close(() => {
            process.exit(1);
        })
    }
    process.exit(1);
});

// Sigterm error 
process.on("SIGINT", () => {
    console.log("Sigint error received. Server is close.");
    if (server) {
        server.close(() => {
            process.exit(1);
        })
    }
    process.exit(1);
});

// unhandled error rejection 
process.on("unhandledRejection", (error) => {
    console.log(`Unhandled error rejection. message: ${error}`);
    if (server) {
        server.close(() => {
            process.exit(1);
        })
    }
    process.exit(1);
})

// uncaught error rejection 
process.on("uncaughtException", (error) => {
    console.log(`Uncaught Exception Error! Server is Off. message : ${error}`);
    if (server) {
        server.close(() => {
            process.exit(1);
        })
    };
    process.exit(1);
});