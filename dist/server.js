"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const envVariable_1 = require("./app/config/envVariable");
const mongoose_1 = __importDefault(require("mongoose"));
const seedSuperAdmin_1 = require("./app/utils/seedSuperAdmin");
let server;
// Configure server and database connected 
const serverStart = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongodbUrl = envVariable_1.envData.MONGODB_CONFIG_URL;
        yield mongoose_1.default.connect(mongodbUrl);
        console.log(`Mongodb database connected.`);
        server = app_1.default.listen(envVariable_1.envData.PORT, () => {
            console.log(`Server is running: http://localhost:${envVariable_1.envData.PORT}`);
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(`Server Error : ${error.message}`);
        }
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield serverStart();
    yield (0, seedSuperAdmin_1.seedSuperAdmin)();
}))();
// Sigterm error 
process.on("SIGTERM", () => {
    console.log("Sigterm error received. Server is close.");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// Sigterm error 
process.on("SIGINT", () => {
    console.log("Sigint error received. Server is close.");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// unhandled error rejection 
process.on("unhandledRejection", (error) => {
    console.log(`Unhandled error rejection. message: ${error}`);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// uncaught error rejection 
process.on("uncaughtException", (error) => {
    console.log(`Uncaught Exception Error! Server is Off. message : ${error}`);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    ;
    process.exit(1);
});
