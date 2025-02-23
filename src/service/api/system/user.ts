import { request } from '../../request';

/** get user list */
export function fetchGetUserList(params?: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    url: '/system/user/list',
    method: 'get',
    params
  });
}

export function fetchUpdateUser(id: string, data: Api.SystemManage.Profile) {
  return request<App.Service.Response>({
    url: `/system/user/update/${id}`,
    method: 'put',
    data
  });
}

// 这个不可以修改部门、角色 用于用户修改
export function fetchUpdateUserProfile(id: string, data: Api.SystemManage.Profile) {
  return request<App.Service.Response>({
    url: `/system/user/updateProfile/${id}`,
    method: 'put',
    data
  });
}

export function fetchUpdatedUserStatus(params: Api.SystemManage.StatusDto) {
  return request<App.Service.Response>({
    url: `/system/user/updateStatus`,
    method: 'put',
    params
  });
}

/** get all pages */
export function fetchGetAllPages() {
  return request<string[]>({
    url: '/systemManage/getAllPages',
    method: 'get'
  });
}

/** get menu tree */
// export function fetchGetMenuTree() {
//   return request<Api.SystemManage.MenuTree[]>({
//     url: '/systemManage/getMenuTree',
//     method: 'get'
//   });
// }
