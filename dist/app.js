"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notFoundRoute_1 = __importDefault(require("./app/middleware/notFoundRoute"));
const routes_1 = require("./app/routes");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandler_1 = require("./app/middleware/globalErrorHandler");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use("/api/v1/", routes_1.router);
// Default Route 
app.get("/", (req, res) => {
    res.json({
        version: "0.2",
        message: "Digital Wallet Server is running."
    });
});
// Global Error Response 
app.use(globalErrorHandler_1.globalErrorHandler);
// Not Found Route 
app.use(notFoundRoute_1.default);
exports.default = app;
