import { request } from '../request';

/**
 * Captcha
 *
 * @param username User name
 * @param password Password
 */
export function fetchCaptchaImg(width?: number, height?: number) {
  return request<Api.Auth.CaptchaImg>({
    url: '/auth/captcha/img',
    method: 'get',
    params: {
      width,
      height
    }
  });
}

/**
 * Login
 *
 * @param username User name
 * @param password Password
 */
export function fetchLogin(data: Api.Auth.LoginDto) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/login',
    method: 'post',
    data
  });
}

/**
 * Login
 *
 * @param username User name
 * @param password Password
 */
export function fetchSuperLogin(data: Api.Auth.LoginDto) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/super/login',
    method: 'post',
    data
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
