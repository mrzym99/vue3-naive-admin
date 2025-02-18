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

export function fetchUpdateDept(data?: Api.SystemManage.Dept) {
  return request<App.Service.Response>({
    url: '/system/dept',
    method: 'put',
    data
  });
}

export function fetchCreateDept(data?: Api.SystemManage.Dept) {
  return request<App.Service.Response>({
    url: '/system/dept',
    method: 'post',
    data
  });
}
