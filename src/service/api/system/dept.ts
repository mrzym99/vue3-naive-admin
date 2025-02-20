import { request } from '../../request';

export function fetchGetDeptTree(params?: Api.SystemManage.DeptSearchParams) {
  return request<Api.SystemManage.DeptTree>({
    url: '/system/dept/tree',
    method: 'get',
    params
  });
}

export function fetchGetDeptList(params?: Api.SystemManage.DeptSearchParams & Api.Common.CommonSearchParams) {
  return request<Api.SystemManage.DeptList>({
    url: '/system/dept/list',
    method: 'get',
    params
  });
}

export function fetchCreateDept(data?: Api.SystemManage.Dept) {
  return request<App.Service.Response>({
    url: '/system/dept',
    method: 'post',
    data
  });
}

export function fetchUpdateDept(data?: Api.SystemManage.Dept) {
  return request<App.Service.Response>({
    url: `/system/dept/${data?.id}`,
    method: 'put',
    data
  });
}

export function fetchSetDeptDefault(id?: string) {
  return request<App.Service.Response>({
    url: `/system/dept/default/${id}`,
    method: 'put'
  });
}

export function fetchDeleteDept(id?: string) {
  return request<App.Service.Response>({
    url: `/system/dept/${id}`,
    method: 'delete'
  });
}
