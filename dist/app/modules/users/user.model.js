"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const userSchemaModel = new mongoose_1.Schema({
    // _id: { type: Schema.Types.ObjectId },
    name: { type: String, trim: true },
    email: { type: String, unique: [true, "Email must be unique."], trim: true, required: [true, "Email is required."] },
    password: { type: String, required: true, minlength: [5, "min 8 character long."] },
    photo: { type: String, trim: true },
    address: { type: String, trim: true },
    role: { type: String, enum: Object.values(user_interface_1.IUserRole), default: user_interface_1.IUserRole.User },
    isActive: { type: String, enum: Object.values(user_interface_1.isActive), default: user_interface_1.isActive.Active },
    isVerified: { type: String, default: true },
    phone: {
        type: String,
        trim: true,
        required: [true, "phone number is required."],
        unique: [true, "phone number is must be unique."]
    },
    walletId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Wallet" },
    userStatus: { type: String, enum: Object.values(user_interface_1.IStatus), default: user_interface_1.IStatus.Pending },
}, {
    versionKey: false,
    timestamps: true
});
exports.User = (0, mongoose_1.model)("user", userSchemaModel);
