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
exports.UserService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = require("../../utils/AppError");
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const envVariable_1 = require("../../config/envVariable");
const wallet_model_1 = require("../wallet/wallet.model");
const transaction_model_1 = require("../transaction/transaction.model");
const transaction_interface_1 = require("../transaction/transaction.interface");
const checkReceiverUser_1 = require("../../utils/checkReceiverUser");
// Create An User 
const createAnUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        const { email, password } = payload;
        const isUserExist = yield user_model_1.User.findOne({ email });
        if (isUserExist) {
            throw new AppError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Email already exist.");
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, Number(envVariable_1.envData.BCRYPT_HASH_ROUND));
        const userData = Object.assign(Object.assign({}, payload), { email, password: hashedPassword });
        const user = yield user_model_1.User.create([userData], { session });
        const superAdminWallet = yield user_model_1.User.findOne({ email: envVariable_1.envData.SUPER_ADMIN_EMAIL });
        if (!superAdminWallet) {
            throw new AppError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Server Response Problem");
        }
        const transactionPayload = {
            send: superAdminWallet._id,
            to: user[0]._id,
            amount: 50,
            fee: transaction_interface_1.ITransFee.Free,
            commission: transaction_interface_1.ITransFee.Free,
            type: transaction_interface_1.IPaymentType.BONUS
        };
        const transaction = yield transaction_model_1.Transaction.create([transactionPayload], { session });
        const digitalWallet = yield wallet_model_1.Wallet.findById(superAdminWallet.walletId);
        const updateDigitalWalletBalance = Number(digitalWallet === null || digitalWallet === void 0 ? void 0 : digitalWallet.balance) - Number(transaction[0].amount);
        const walletPayload = {
            user: user[0]._id,
            balance: transaction[0].amount,
            transaction: [transaction[0]._id]
        };
        const wallet = yield wallet_model_1.Wallet.create([walletPayload], { session });
        yield wallet_model_1.Wallet.findByIdAndUpdate(superAdminWallet.walletId, {
            balance: updateDigitalWalletBalance,
            $push: {
                "transaction": transaction[0]._id
            }
        }, { session });
        const updateUser = yield user_model_1.User.findByIdAndUpdate(user[0]._id, { walletId: wallet[0]._id }, { session, new: true }).select("-password").populate("walletId");
        yield session.commitTransaction();
        session.endSession();
        return updateUser;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// Get All Users Service 
const getAllUsers = (limit) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({}).populate("walletId", "balance").limit(limit).select("-password");
    const userCount = yield user_model_1.User.countDocuments();
    return {
        total: {
            count: userCount
        },
        users,
    };
});
// Get Me User
const getMeUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).populate("walletId", "balance").select("-password");
    if (!user) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "User not found.");
    }
    return user;
});
// Get Single User
const getSingleUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).populate("walletId").select("-password");
    if (!user) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "User not found.");
    }
    return user;
});
// Update An User 
const updateAnUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role === user_interface_1.IUserRole.User || decodedToken.role === user_interface_1.IUserRole.Agent) {
        if (userId !== decodedToken.userId) {
            throw new AppError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "You are not authorized.");
        }
    }
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "User does not found.");
    }
    if (decodedToken.role === user_interface_1.IUserRole.Admin || decodedToken.role === user_interface_1.IUserRole.Super_Admin) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "You are not authorized.");
    }
    ;
    if (payload.role) {
        if (decodedToken.role === user_interface_1.IUserRole.User || decodedToken.role === user_interface_1.IUserRole.Agent) {
            throw new AppError_1.AppError(http_status_codes_1.StatusCodes.FORBIDDEN, "Your are not authorized.");
        }
    }
    if (payload.isActive || payload.isVerified) {
        if (decodedToken.role === user_interface_1.IUserRole.User || decodedToken.role === user_interface_1.IUserRole.Agent) {
            throw new AppError_1.AppError(http_status_codes_1.StatusCodes.FORBIDDEN, "Your are not authorized.");
        }
    }
    ;
    const newUpdateUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true, }).select("-password");
    return newUpdateUser;
});
// Update An User Role
const updateAnUserRole = (email, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role === payload.role) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "You can not perform this role change.");
    }
    if (decodedToken.role !== user_interface_1.IUserRole.Super_Admin) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "You are not authorized for this route.");
    }
    // user find 
    const user = yield user_model_1.User.findOne({ email });
    // If User not found 
    if (!user) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "User does not found.");
    }
    // check User status or is active 
    (0, checkReceiverUser_1.checkReceiverUser)(user);
    //If User is Super_Admin than he can't change his role.
    if (user.role === user_interface_1.IUserRole.Super_Admin) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "You can't perform your role change work.");
    }
    // If user role is user | agent | admin he can't change role
    if (decodedToken.role === user_interface_1.IUserRole.User || decodedToken.role === user_interface_1.IUserRole.Agent) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "You are not authorized.");
    }
    ;
    // if payload role is super admin or user role and payload role is equal 
    if (payload.role) {
        if (payload.role === user_interface_1.IUserRole.Super_Admin || payload.role === user.role) {
            throw new AppError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "User already in this role.");
        }
        ;
    }
    // Update User role perform 
    const newUpdateUser = yield user_model_1.User.findByIdAndUpdate(user._id, payload, { new: true, runValidators: true, }).select("-password");
    return newUpdateUser;
});
// User Status Update 
const updateAnUserStatus = (email, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role !== user_interface_1.IUserRole.Super_Admin || decodedToken.role !== user_interface_1.IUserRole.Admin) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "You can not perform user status change.");
    }
    // user find 
    const user = yield user_model_1.User.findOne({ email });
    // If User not found 
    if (!user) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "User does not found.");
    }
    // check User status or is active 
    (0, checkReceiverUser_1.checkReceiverUser)(user);
    //If User is Super_Admin than he can't change his role.
    if (user.role === user_interface_1.IUserRole.Super_Admin || user.role === user_interface_1.IUserRole.Admin) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "You can't perform your role change work.");
    }
    // if payload role is super admin or user role and payload role is equal 
    if (payload.userStatus) {
        if (payload.userStatus === user.userStatus) {
            throw new AppError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "You can't perform this work.");
        }
        ;
    }
    // Update User role perform 
    const newUpdateUser = yield user_model_1.User.findByIdAndUpdate(user._id, payload, { new: true, runValidators: true, }).select("-password");
    return newUpdateUser;
    return;
});
const updateAnUserIsActive = (email, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    // user find 
    const user = yield user_model_1.User.findOne({ email });
    // If User not found 
    if (!user) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "User does not found.");
    }
    // check User status or is active 
    (0, checkReceiverUser_1.checkReceiverUser)(user);
    // super admin adn admin can only do bloced user account 
    if (payload.isActive === user_interface_1.isActive.Blocked && decodedToken.role !== (user_interface_1.IUserRole.Super_Admin || user_interface_1.IUserRole.Admin)) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, "You are not authorized for this perform.");
    }
    //If User is Super_Admin than he can't change his role.
    if (user.role === user_interface_1.IUserRole.Super_Admin) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.NOT_FOUND, "You can't perform your role change work.");
    }
    // if already user has this status 
    if (payload.isActive === user.isActive) {
        throw new AppError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, `Your account already ${user.isActive}.`);
    }
    // if role is not super admin or admin then it check token userid and user id 
    if (decodedToken.role !== user_interface_1.IUserRole.Super_Admin || decodedToken.role !== user_interface_1.IUserRole.Admin) {
        if (user._id !== decodedToken.userId) {
            throw new AppError_1.AppError(http_status_codes_1.StatusCodes.BAD_REQUEST, `You are not authorized.`);
        }
    }
    // Update User role perform 
    const newUpdateUser = yield user_model_1.User.findByIdAndUpdate(user._id, payload, { new: true, runValidators: true, }).select("-password");
    return newUpdateUser;
});
exports.UserService = {
    createAnUser,
    getAllUsers,
    getMeUser,
    getSingleUser,
    updateAnUser,
    updateAnUserRole,
    updateAnUserStatus,
    updateAnUserIsActive
};
