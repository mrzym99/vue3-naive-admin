import { request } from '../request';

/** Get user info */
export function fetchGetUserInfo() {
  return request<Api.Auth.UserInfo>({ url: '/auth/account/profile' });
}

/** Get user permissions */
export function fetchGetUserPermissions() {
  return request<string[]>({ url: '/auth/account/permissions' });
}

/** 回去账户详细信息 */
export function fetchGetAccountInfo() {
  return request<Api.SystemManage.User>({
    url: '/auth/account/profile'
  });
}
export function fetchUpdateAccount(data: Partial<Api.SystemManage.User>) {
  return request({
    url: '/auth/account/profile',
    method: 'put',
    data
  });
}

export function fetchUpdateAccountPassword(data: Api.Auth.updatePasswordDto) {
  return request({
    url: '/auth/account/password',
    method: 'put',
    data
  });
}
