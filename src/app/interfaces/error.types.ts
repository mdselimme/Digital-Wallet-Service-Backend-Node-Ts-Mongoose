

export interface IErrorResponse {
    path: string,
    message: string
}

export interface IGenericErrorResponse {
    statusCode: number
    message: string
    errorSources?: IErrorResponse[]
}