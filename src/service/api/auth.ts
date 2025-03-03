import { request } from '../request';

/**
 * Captcha
 *
 * @param username User name
 * @param password Password
 */
export function fetchGetCaptchaImg(width?: number, height?: number) {
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
 * Captcha
 *
 * @param username User name
 * @param password Password
 */
export function fetchGetCaptchaEmail(email: string) {
  return request({
    url: '/auth/email/send',
    method: 'post',
    data: {
      email
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
 * register
 *
 * @param username User name
 * @param password Password
 */
export function fetchRegister(data: Api.Auth.RegisterDto) {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  });
}

/**
 * Refresh token
 *
 * @param accessToken Access token
 */
export function fetchRefreshToken(accessToken: string) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/refreshToken',
    method: 'post',
    data: {
      accessToken
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
