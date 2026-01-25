import { Types } from "mongoose"



export enum IUserRole {
    Admin = "Admin",
    Super_Admin = "Super_Admin",
    User = "User",
    Agent = "Agent"
}

export enum isActive {
    Active = "Active",
    Blocked = "Blocked",
    Deleted = "Deleted"
}

export enum IStatus {
    Approve = "Approve",
    Pending = "Pending",
    Suspend = "Suspend"
}


export interface IUserModel {
    _id?: Types.ObjectId,
    name?: string,
    email: string,
    photo?: string,
    password: string,
    address?: string,
    walletId?: Types.ObjectId,
    role?: IUserRole,
    webTour: boolean,
    isActive?: isActive,
    isVerified?: boolean,
    phone: string,
    userStatus?: IStatus
};