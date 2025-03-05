export const VERIFICATION_ROUTE = '/verification/';
export const RESET_PASSWORD_ROUTE = '/reset-password/';
export const APP_NAME = 'Social App';

export enum TOKEN_EXPIRATION {
  'VERIFICATION' = '2m',
  'DEFAULT' = '1d',
}

export enum CALL_STATUS {
  RECEIVED = 'RECEIVED',
  REJECTED = 'REJECTED',
  MISSED = 'MISSED',
}
