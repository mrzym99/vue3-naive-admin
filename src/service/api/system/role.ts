import { request } from '../../request';

export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams & Api.Common.CommonSearchParams) {
  return request<Api.SystemManage.RoleList>({
    url: '/system/role/list',
    method: 'get',
    params
  });
}

export function fetchCreateRole(data?: Api.SystemManage.Role) {
  return request<App.Service.Response>({
    url: '/system/role',
    method: 'post',
    data
  });
}

export function fetchUpdateRole(data?: Api.SystemManage.Role) {
  return request<App.Service.Response>({
    url: `/system/role/${data?.id}`,
    method: 'put',
    data
  });
}

export function fetchDeleteRole(id?: string) {
  return request<App.Service.Response>({
    url: `/system/role/${id}`,
    method: 'delete'
  });
}
