import { request } from '../request';

/**
 * Login
 *
 * @param username User name
 * @param password Password
 */
export function fetchLogin(username: string, password: string, code: string) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/login',
    method: 'post',
    data: {
      username,
      password,
      code
    }
  });
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/refreshToken',
    method: 'post',
    data: {
      refreshToken
    }
  });
}

/**
 * return custom backend error
 *
 * @param code error code
 * @param msg error message
 */
export function fetchCustomBackendError(code: string, msg: string) {
  return request({ url: '/auth/error', params: { code, msg } });
}
