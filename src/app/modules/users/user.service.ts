import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/AppError";
import { isActive, IUserModel, IUserRole } from "./user.interface"
import { User } from "./user.model";
import bcrypt from "bcrypt";
import { envData } from "../../config/envVariable";
import { Wallet } from "../wallet/wallet.model";
import { IWallet } from "../wallet/wallet.interface";
import { Transaction } from "../transaction/transaction.model";
import { IPaymentType, ITransaction, ITransFee } from "../transaction/transaction.interface";
import { JwtPayload } from "jsonwebtoken";
import { checkReceiverUser } from "../../utils/checkReceiverUser";


// Create An User 
const createAnUser = async (payload: Partial<IUserModel>) => {

    const session = await User.startSession();

    session.startTransaction();

    try {
        const { email, password } = payload;

        const isUserExist = await User.findOne({ email });

        if (isUserExist) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Email already exist.");
        }

        const hashedPassword = await bcrypt.hash(password as string, Number(envData.BCRYPT_HASH_ROUND));

        const userData = {
            ...payload,
            email,
            password: hashedPassword
        };

        const user = await User.create([userData], { session });

        const superAdminWallet = await User.findOne({ email: envData.SUPER_ADMIN_EMAIL });

        if (!superAdminWallet) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Server Response Problem");
        }

        const transactionPayload: ITransaction = {
            send: superAdminWallet._id,
            to: user[0]._id,
            amount: 50,
            fee: ITransFee.Free,
            commission: ITransFee.Free,
            type: IPaymentType.BONUS
        };

        const transaction = await Transaction.create([transactionPayload], { session });

        const digitalWallet = await Wallet.findById(superAdminWallet.walletId);

        const updateDigitalWalletBalance = Number(digitalWallet?.balance) as number - Number(transaction[0].amount);

        const walletPayload: IWallet = {
            user: user[0]._id,
            balance: transaction[0].amount,
            transaction: [transaction[0]._id]
        };

        const wallet = await Wallet.create([walletPayload], { session });

        await Wallet.findByIdAndUpdate(superAdminWallet.walletId, {
            balance: updateDigitalWalletBalance,
            $push: {
                "transaction": transaction[0]._id
            }
        }, { session });

        const updateUser = await User.findByIdAndUpdate(user[0]._id, { walletId: wallet[0]._id }, { session, new: true }).select("-password").populate("walletId");

        await session.commitTransaction();

        session.endSession();

        return updateUser;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

// Get All Users Service 
const getAllUsers = async (limit: number) => {

    const users = await User.find({}).populate("walletId", "balance").limit(limit).select("-password");

    const userCount = await User.countDocuments();

    return {
        total: {
            count: userCount
        },
        users,
    }
};

// Get Me User
const getMeUser = async (userId: string) => {

    const user = await User.findById(userId).populate("walletId", "balance").select("-password");

    if (!user) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User not found.");
    }

    return user;
};

// Get Single User
const getSingleUser = async (userId: string) => {

    const user = await User.findById(userId).populate("walletId").select("-password");

    if (!user) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User not found.");
    }

    return user;
};

// Update An User 
const updateAnUser = async (userId: string, payload: Partial<IUserModel>, decodedToken: JwtPayload) => {

    if (decodedToken.role === IUserRole.User || decodedToken.role === IUserRole.Agent) {
        if (userId !== decodedToken.userId) {
            throw new AppError(StatusCodes.BAD_REQUEST, "You are not authorized.");
        }
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User does not found.");
    }

    if (decodedToken.role === IUserRole.Admin || decodedToken.role === IUserRole.Super_Admin) {
        throw new AppError(StatusCodes.BAD_REQUEST, "You are not authorized.");
    };

    if (payload.role) {
        if (decodedToken.role === IUserRole.User || decodedToken.role === IUserRole.Agent) {
            throw new AppError(StatusCodes.FORBIDDEN, "Your are not authorized.");
        }
    }

    if (payload.isActive || payload.isVerified) {
        if (decodedToken.role === IUserRole.User || decodedToken.role === IUserRole.Agent) {
            throw new AppError(StatusCodes.FORBIDDEN, "Your are not authorized.");
        }
    };

    const newUpdateUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true, }).select("-password");

    return newUpdateUser;
};

// Update An User Role
const updateAnUserRole = async (email: string, payload: Partial<IUserModel>, decodedToken: JwtPayload) => {
    if (decodedToken.role === payload.role) {
        throw new AppError(StatusCodes.BAD_REQUEST, "You can not perform this role change.")
    }
    if (decodedToken.role !== IUserRole.Super_Admin) {
        throw new AppError(StatusCodes.BAD_REQUEST, "You are not authorized for this route.")
    }
    // user find 
    const user = await User.findOne({ email });
    // If User not found 
    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User does not found.");
    }
    // check User status or is active 
    checkReceiverUser(user as IUserModel)
    //If User is Super_Admin than he can't change his role.
    if (user.role === IUserRole.Super_Admin) {
        throw new AppError(StatusCodes.NOT_FOUND, "You can't perform your role change work.");
    }
    // If user role is user | agent | admin he can't change role
    if (decodedToken.role === IUserRole.User || decodedToken.role === IUserRole.Agent) {
        throw new AppError(StatusCodes.BAD_REQUEST, "You are not authorized.");
    };
    // if payload role is super admin or user role and payload role is equal 
    if (payload.role) {
        if (payload.role === IUserRole.Super_Admin || payload.role === user.role) {
            throw new AppError(StatusCodes.BAD_REQUEST, "User already in this role.");
        };
    }
    // Update User role perform 
    const newUpdateUser = await User.findByIdAndUpdate(user._id, payload, { new: true, runValidators: true, }).select("-password");

    return newUpdateUser;
};

// User Status Update 
const updateAnUserStatus = async (email: string, payload: Partial<IUserModel>, decodedToken: JwtPayload) => {
    if (decodedToken.role !== IUserRole.Super_Admin || decodedToken.role !== IUserRole.Admin) {
        throw new AppError(StatusCodes.BAD_REQUEST, "You can not perform user status change.")
    }
    // user find 
    const user = await User.findOne({ email });
    // If User not found 
    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User does not found.");
    }
    // check User status or is active 
    checkReceiverUser(user as IUserModel)
    //If User is Super_Admin than he can't change his role.
    if (user.role === IUserRole.Super_Admin || user.role === IUserRole.Admin) {
        throw new AppError(StatusCodes.NOT_FOUND, "You can't perform your role change work.");
    }
    // if payload role is super admin or user role and payload role is equal 
    if (payload.userStatus) {
        if (payload.userStatus === user.userStatus) {
            throw new AppError(StatusCodes.BAD_REQUEST, "You can't perform this work.");
        };
    }
    // Update User role perform 
    const newUpdateUser = await User.findByIdAndUpdate(user._id, payload, { new: true, runValidators: true, }).select("-password");

    return newUpdateUser;
    return
}

const updateAnUserIsActive = async (email: string, payload: Partial<IUserModel>, decodedToken: JwtPayload) => {

    // user find 
    const user = await User.findOne({ email });
    // If User not found 
    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User does not found.");
    }
    // check User status or is active 
    checkReceiverUser(user as IUserModel);
    // super admin adn admin can only do bloced user account 
    if (payload.isActive === isActive.Blocked && decodedToken.role !== (IUserRole.Super_Admin || IUserRole.Admin)) {
        throw new AppError(StatusCodes.BAD_REQUEST, "You are not authorized for this perform.");
    }
    //If User is Super_Admin than he can't change his role.
    if (user.role === IUserRole.Super_Admin) {
        throw new AppError(StatusCodes.NOT_FOUND, "You can't perform your role change work.");
    }
    // if already user has this status 
    if (payload.isActive === user.isActive) {
        throw new AppError(StatusCodes.BAD_REQUEST, `Your account already ${user.isActive}.`);
    }
    // if role is not super admin or admin then it check token userid and user id 
    if (decodedToken.role !== IUserRole.Super_Admin || decodedToken.role !== IUserRole.Admin) {
        if (user._id !== decodedToken.userId) {
            throw new AppError(StatusCodes.BAD_REQUEST, `You are not authorized.`);
        }
    }
    // Update User role perform 
    const newUpdateUser = await User.findByIdAndUpdate(user._id, payload, { new: true, runValidators: true, }).select("-password");

    return newUpdateUser;
};



export const UserService = {
    createAnUser,
    getAllUsers,
    getMeUser,
    getSingleUser,
    updateAnUser,
    updateAnUserRole,
    updateAnUserStatus,
    updateAnUserIsActive
}