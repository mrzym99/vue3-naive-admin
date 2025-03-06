import { request } from '../request';

/** Get user info */
export function fetchGetUserInfo() {
  return request<Api.Auth.UserInfo>({ url: '/auth/account/profile' });
}

/** Get user permissions */
export function fetchGetUserPermissions() {
  return request<string[]>({ url: '/auth/account/permissions' });
}
