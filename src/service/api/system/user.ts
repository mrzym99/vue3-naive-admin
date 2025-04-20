import { request } from '../../request';

/** get user list */
export function fetchGetUserList(params?: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    url: '/system/user/list',
    method: 'get',
    params
  });
}

export function fetchCreateUser(data: Partial<Api.SystemManage.User>) {
  return request({
    url: `/system/user/create`,
    method: 'post',
    data
  });
}

export function fetchUpdateUser(id: number, data: Partial<Api.SystemManage.User>) {
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

export function fetchUpdatedUserStatus(data: Api.SystemManage.StatusDto) {
  return request({
    url: `/system/user/updateStatus`,
    method: 'put',
    data
  });
}

/** delete */
export function fetchDeleteUser(id: number | null) {
  return request({
    url: `/system/user/delete/${id}`,
    method: 'delete'
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
