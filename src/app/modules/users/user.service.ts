import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/AppError";
import { IUserModel } from "./user.interface"
import { User } from "./user.model";
import bcrypt from "bcrypt";
import { envData } from "../../config/envVariable";


// Create An User 
const createAnUser = async (payload: Partial<IUserModel>) => {

    const { email, password } = payload;

    const user = await User.findOne({ email });

    if (user) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Email already exist.");
    }

    const hashedPassword = await bcrypt.hash(password as string, Number(envData.BCRYPT_HASH_ROUND));

    const userData = {
        ...payload,
        email,
        password: hashedPassword
    };

    const result = await User.create(userData);

    return result;

};








export const UserService = { createAnUser }