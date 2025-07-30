import mongoose from "mongoose";
import { IGenericErrorResponse } from "../interfaces/error.types";


export const handleCastError = (err: mongoose.Error.CastError): IGenericErrorResponse => {

    return {
        statusCode: 400,
        message: `Invalid mongodb objectId. Please give a valid id. ${err.message}`
    }
}