const common = {
  STANDARD: {
    CREATED: 201,
    SUCCESS: 200,
    NOCONTENT: 204,
  },
  ERROR404: {
    CODE: 404,
    MESSAGE: 'PAGE_NOT_FOUND',
  },
  ERROR403: {
    CODE: 403,
    MESSAGE: 'FORBIDDEN_ACCESS',
  },
  ERROR401: {
    CODE: 401,
    MESSAGE: 'UNAUTHORIZED',
  },
  ERROR500: {
    CODE: 500,
    MESSAGE: 'TRY_AGAIN',
  },
  ERROR422: 422,
  ERROR409: {
    CODE: 409,
    MESSAGE: 'DUPLICATE_FOUND',
  },
  ERROR400: {
    CODE: 400,
    MESSAGE: 'ERR_BAD_REQUEST',
  },
  otp: {
    optExpire: 1 * 3600 * 1000, // 1 hour
  },
  pager: {
    page: 0,
    limit: 10,
  },
};

module.exports = common;
