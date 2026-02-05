import { model, Schema } from "mongoose";
import { isActive, IStatus, IUserModel, IUserRole } from "./user.interface";


const userSchemaModel = new Schema<IUserModel>({
    // _id: { type: Schema.Types.ObjectId },
    name: { type: String, trim: true },
    email: { type: String, unique: [true, "Email already taken. Email must be unique."], trim: true, required: [true, "Email is required."] },
    password: { type: String, required: true, minlength: [5, "min 8 character long."] },
    photo: { type: String, trim: true },
    address: { type: String, trim: true },
    role: { type: String, enum: Object.values(IUserRole), default: IUserRole.User },
    webTour: { type: Boolean, default: false },
    isActive: { type: String, enum: Object.values(isActive), default: isActive.Active },
    isVerified: { type: Boolean, default: true },
    phone: {
        type: String,
        trim: true,
        required: [true, "phone number is required."],
        unique: [true, "Phone number already taken. try another number."]
    },
    walletId: { type: Schema.Types.ObjectId, ref: "Wallet" },
    userStatus: { type: String, enum: Object.values(IStatus), default: IStatus.Approve },
}, {
    versionKey: false,
    timestamps: true
});


export const User = model<IUserModel>("user", userSchemaModel);

