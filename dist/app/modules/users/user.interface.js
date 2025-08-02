"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IStatus = exports.isActive = exports.IUserRole = void 0;
var IUserRole;
(function (IUserRole) {
    IUserRole["Admin"] = "Admin";
    IUserRole["Super_Admin"] = "Super_Admin";
    IUserRole["User"] = "User";
    IUserRole["Agent"] = "Agent";
})(IUserRole || (exports.IUserRole = IUserRole = {}));
var isActive;
(function (isActive) {
    isActive["Active"] = "Active";
    isActive["Blocked"] = "Blocked";
    isActive["Deleted"] = "Deleted";
})(isActive || (exports.isActive = isActive = {}));
var IStatus;
(function (IStatus) {
    IStatus["Approve"] = "Approve";
    IStatus["Pending"] = "Pending";
    IStatus["Suspend"] = "Suspend";
})(IStatus || (exports.IStatus = IStatus = {}));
;
