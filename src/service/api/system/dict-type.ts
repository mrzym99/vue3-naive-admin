import { request } from '../../request';

export function fetchGetDictTypeList(params?: Api.SystemManage.DictTypeSearchParams) {
  return request<Api.SystemManage.DictTypeList>({
    url: '/system/dict-type/list',
    method: 'get',
    params
  });
}

export function fetchGetDictItemListByCode(code: string) {
  return request<Api.SystemManage.DictTypeList>({
    url: `/system/dict-type/dictItemList/${code}`,
    method: 'get'
  });
}

export function fetchGetDictTypeInfo(id?: string) {
  return request<Api.SystemManage.DictType>({
    url: `/system/dict-type/info/${id}`,
    method: 'get'
  });
}

export function fetchCreateDictType(data?: Api.SystemManage.DictType) {
  return request({
    url: '/system/dict-type',
    method: 'post',
    data
  });
}

export function fetchUpdateDictType(data?: Api.SystemManage.DictType) {
  return request({
    url: `/system/dict-type/update/${data?.id}`,
    method: 'put',
    data
  });
}

export function fetchBatchUpdateDictTypeStatus(data: Api.SystemManage.StatusDto) {
  return request({
    url: `/system/dict-type/updateStatus`,
    method: 'put',
    data
  });
}

export function fetchDeleteDictType(id?: string) {
  return request({
    url: `/system/dict-type/${id}`,
    method: 'delete'
  });
}
