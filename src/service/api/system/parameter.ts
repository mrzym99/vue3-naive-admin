import { request } from '../../request';

export function fetchGetParameterList(params?: Api.SystemManage.ParameterSearchParams) {
  return request<Api.SystemManage.ParameterList>({
    url: '/system/parameter/list',
    method: 'get',
    params
  });
}

export function fetchParameterByKey(key: string) {
  return request<string>({
    url: `/system/parameter/value/${key}`,
    method: 'get'
  });
}

export function fetchGetParameterInfo(id?: number) {
  return request<Api.SystemManage.Parameter>({
    url: `/system/parameter/info/${id}`,
    method: 'get'
  });
}

export function fetchCreateParameter(data?: Api.SystemManage.Parameter) {
  return request({
    url: '/system/parameter',
    method: 'post',
    data
  });
}

export function fetchUpdateParameter(data?: Api.SystemManage.Parameter) {
  return request({
    url: `/system/parameter/${data?.id}`,
    method: 'put',
    data
  });
}

export function fetchDeleteParameter(id?: number) {
  return request({
    url: `/system/parameter/${id}`,
    method: 'delete'
  });
}
