/* eslint-disable no-console */
import { envData } from "../config/envVariable"
import { IStatus, IUserModel, IUserRole } from "../modules/users/user.interface";
import { User } from "../modules/users/user.model"
import bcrypt from "bcrypt";






export const seedSuperAdmin = async () => {

    try {
        const isSuperAdminExist = await User.findOne({ email: envData.SUPER_ADMIN_EMAIL });
        if (isSuperAdminExist) {
            console.log("Super admin Already Exist.");
            return;
        };

        console.log("Trying to create super admin.");

        const hashPassword = await bcrypt.hash(envData.SUPER_ADMIN_PASS, Number(envData.BCRYPT_HASH_ROUND));

        const payload: IUserModel = {
            name: "Digital Wallet",
            role: IUserRole.Super_Admin,
            email: envData.SUPER_ADMIN_EMAIL,
            password: hashPassword,
            phone: envData.SUPER_ADMIN_PHONE,
            isVerified: true,
            userStatus: IStatus.Approve
        };

        await User.create(payload);
        console.log("Super admin created.")

    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message)
        }
    }

}