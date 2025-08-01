"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ITransFee = exports.IPaymentType = void 0;
var IPaymentType;
(function (IPaymentType) {
    IPaymentType["CASH_IN"] = "CASH_IN";
    IPaymentType["SEND_MONEY"] = "SEND_MONEY";
    IPaymentType["CASH_OUT"] = "CASH_OUT";
    IPaymentType["BONUS"] = "BONUS";
    IPaymentType["ADD_MONEY"] = "ADD_MONEY";
    IPaymentType["B2B"] = "B2B";
})(IPaymentType || (exports.IPaymentType = IPaymentType = {}));
;
var ITransFee;
(function (ITransFee) {
    ITransFee[ITransFee["Agent"] = 0.5] = "Agent";
    ITransFee[ITransFee["User"] = 0.3] = "User";
    ITransFee[ITransFee["CashOut"] = 1] = "CashOut";
    ITransFee[ITransFee["Free"] = 0] = "Free";
})(ITransFee || (exports.ITransFee = ITransFee = {}));
