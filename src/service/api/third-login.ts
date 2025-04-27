import { request } from '../request';

/** 获取三方登录跳转的url */
export function fetchGetLoginRedirectUrl(type: string) {
  return request<string>({
    url: `/auth/third-login/url/${type}`,
    method: 'get'
  });
}

/** 获取 token_type 和 access_token */
export function fetchGetTokenTypeAndToken(params: Api.Auth.ThirdCodeDto) {
  return request<Api.Auth.ThirdTokenModel>({
    url: '/auth/third-login/getTypeAndToken',
    method: 'get',
    params
  });
}

/** 判断用户是否已经注册 */
export function fetchCheckHasRegister(params: Api.Auth.ThirdLoginDto) {
  return request({
    url: '/auth/third-login/checkRegister',
    method: 'get',
    params
  });
}

/** 三方登录 */
export function fetchThirdLogin(data: Api.Auth.ThirdLoginDto) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/third-login/login',
    method: 'post',
    data
  });
}
