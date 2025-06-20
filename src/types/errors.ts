export enum ErrorType {
  AUTHENTICATION_ERROR = 'authentication_error',
  VALIDATION_ERROR = 'validation_error',
  NOT_FOUND_ERROR = 'not_found_error',
  RATE_LIMIT_ERROR = 'rate_limit_error',
  SERVER_ERROR = 'server_error',
}

export interface ErrorDetails {
  type: ErrorType;
  message: string;
  code?: string;
}

export interface ErrorResponse {
  error: ErrorDetails;
}