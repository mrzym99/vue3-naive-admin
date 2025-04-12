import { request } from '../../request';

export function fetchGetMenuTree(params?: Api.SystemManage.MenuSearchParams) {
  return request<Api.SystemManage.MenuTree>({
    url: '/system/menu/tree',
    method: 'get',
    params
  });
}

export function fetchGetMenuList(params?: Api.SystemManage.MenuSearchParams) {
  return request<Api.SystemManage.MenuList>({
    url: '/system/menu/list',
    method: 'get',
    params
  });
}

export function fetchCreateMenu(data?: Api.SystemManage.Menu) {
  return request({
    url: '/system/menu',
    method: 'post',
    data
  });
}

export function fetchUpdateMenu(data?: Api.SystemManage.Menu) {
  return request({
    url: `/system/menu/update/${data?.id}`,
    method: 'put',
    data
  });
}

export function fetchUpdatedMenuStatus(params: Api.SystemManage.StatusDto) {
  return request({
    url: `/system/menu/updateStatus`,
    method: 'put',
    params
  });
}

export function fetchDeleteMenu(id?: number) {
  return request({
    url: `/system/menu/${id}`,
    method: 'delete'
  });
}

export function fetchGetAllPermissions() {
  return request({
    url: `/system/menu/permissions`,
    method: 'get'
  });
}
