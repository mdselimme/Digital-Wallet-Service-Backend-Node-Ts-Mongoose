import { model, Schema } from "mongoose";
import { isActive, IStatus, IUserModel, IUserRole } from "./user.interface";





const userSchemaModel = new Schema<IUserModel>({
    _id: { type: Schema.Types.ObjectId },
    name: { type: String, trim: true },
    email: { type: String, unique: [true, "Email must be unique."], trim: true, required: [true, "Email is required."] },
    password: { type: String, required: true, minlength: [8, "min 8 character long."] },
    photo: { type: String, trim: true },
    address: { type: String, trim: true },
    role: { type: String, enum: Object.values(IUserRole), default: IUserRole.User },
    isActive: { type: String, enum: Object.values(isActive), default: isActive.Active },
    isVerified: { type: String, default: false },
    phone: {
        type: String,
        trim: true
    },
    walletId: { type: Schema.Types.ObjectId },
    userStatus: { type: String, enum: Object.values(IStatus), default: IStatus.Pending },
}, {
    versionKey: false,
    timestamps: true
});


export const User = model("user", userSchemaModel);

