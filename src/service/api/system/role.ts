import { request } from '../../request';

export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams) {
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

export function fetchGetRoleInfo(id?: number) {
  return request<Api.SystemManage.Role>({
    url: `/system/role/info/${id}`,
    method: 'get'
  });
}

export function fetchCreateRole(data?: Api.SystemManage.Role) {
  return request({
    url: '/system/role',
    method: 'post',
    data
  });
}

export function fetchUpdateRole(data?: Api.SystemManage.Role) {
  return request({
    url: `/system/role/${data?.id}`,
    method: 'put',
    data
  });
}

export function fetchSetRoleDefault(id?: number) {
  return request({
    url: `/system/role/default/${id}`,
    method: 'put'
  });
}
export function fetchDeleteRole(id?: number) {
  return request({
    url: `/system/role/${id}`,
    method: 'delete'
  });
}
