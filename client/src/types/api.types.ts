export interface ValidationErrorDetail {
    loc: (string | number)[];
    msg: string;
    type: string;
}

export interface ApiErrorResponse {
    detail: string | ValidationErrorDetail[];
}