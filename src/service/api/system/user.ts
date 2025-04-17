import { request } from '../../request';

/** get user list */
export function fetchGetUserList(params?: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    url: '/system/user/list',
    method: 'get',
    params
  });
}

export function fetchUpdateUser(id: number, data: Api.SystemManage.Profile) {
  return request({
    url: `/system/user/update/${id}`,
    method: 'put',
    data
  });
}

// 这个不可以修改部门、角色 用于用户修改
export function fetchUpdateUserProfile(id: number, data: Api.SystemManage.Profile) {
  return request({
    url: `/system/user/updateProfile/${id}`,
    method: 'put',
    data
  });
}

export function fetchUpdatedUserStatus(params: Api.SystemManage.StatusDto) {
  return request({
    url: `/system/user/updateStatus`,
    method: 'put',
    params
  });
}

/** reset password */
export function fetchResetPassword(id: number | null, data: Api.SystemManage.resetPasswordDto) {
  return request({
    url: `/system/user/resetPassword/${id}`,
    method: 'put',
    data
  });
}
