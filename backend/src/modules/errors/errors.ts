export enum ErrorCodeAPi {
    BAD_REQUEST = "BAD_REQUEST",
    NOT_FOUND = "NOT_FOUND",
    INTERNAL_ERROR = "INTERNAL_ERROR",
    CONFLIT = "CONFLIT",
    NOT_IMPLEMENTED = "NOT_IMPLEMENTED",
    FORBIDDEN = "FORBIDDEN"
}

type ErrorMap = {
    [key in ErrorCodeAPi]: { code: string, statusCode: number };
};

const ErrorTypeApi: ErrorMap = {
    BAD_REQUEST: { code: 'Bad Request', statusCode: 400 },
    FORBIDDEN: { code : 'Forbidden', statusCode: 403 },
    NOT_FOUND: { code: 'Not Found', statusCode: 404 },
    CONFLIT: { code : 'Conflict', statusCode: 409 },
    INTERNAL_ERROR: { code: 'Internal Error', statusCode: 500 },
    NOT_IMPLEMENTED: { code: 'Not Implemented', statusCode: 501 },
};

export class ApiError extends Error {
    public name: string
    public code: string
    public statusCode: number
    public message: string
    public errors?: ApiError[]

    constructor(errorType: ErrorCodeAPi, message?: string, errors?: ApiError[]) {
        super();
        const { code, statusCode } = ErrorTypeApi[errorType];
        this.name = 'ImomeApiError'
        this.code = code
        this.statusCode = statusCode
        this.message = message
        this.errors = errors
    }
}

export function throwError(e: ApiError) {
    throw e
}
