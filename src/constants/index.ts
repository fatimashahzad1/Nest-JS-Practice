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

export enum POST_TYPE {
  EVENT = 'EVENT', // 1
  FEED = 'FEED', //2
}

export enum POST_TYPE_NUMBER {
  EVENT = 1, //'EVENT'
  FEED = 2, // 'FEED'
}
