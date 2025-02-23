import { request } from '../../request';

export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams & Api.Common.CommonSearchParams) {
  return request<Api.SystemManage.RoleList>({
    url: '/system/role/list',
    method: 'get',
    params
  });
}

export function fetchGetAllRole() {
  return request<Api.SystemManage.Role[]>({
    url: '/system/role/all',
    method: 'get'
  });
}

export function fetchGetRoleInfo(id?: string) {
  return request<Api.SystemManage.Role>({
    url: `/system/role/info/${id}`,
    method: 'get'
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

export function fetchSetRoleDefault(id?: string) {
  return request<App.Service.Response>({
    url: `/system/role/default/${id}`,
    method: 'put'
  });
}
export function fetchDeleteRole(id?: string) {
  return request<App.Service.Response>({
    url: `/system/role/${id}`,
    method: 'delete'
  });
}
