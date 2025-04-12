import { request } from '../../request';

export function fetchGetDictItemList(params?: Api.SystemManage.DictItemSearchParams) {
  return request<Api.SystemManage.DictItemList>({
    url: '/system/dict-item/list',
    method: 'get',
    params
  });
}

export function fetchGetDictItemInfo(id?: number) {
  return request<Api.SystemManage.DictItem>({
    url: `/system/dict-item/info/${id}`,
    method: 'get'
  });
}

export function fetchCreateDictItem(data?: Api.SystemManage.DictItem) {
  return request({
    url: '/system/dict-item',
    method: 'post',
    data
  });
}

export function fetchUpdateDictItem(data?: Api.SystemManage.DictItem) {
  return request({
    url: `/system/dict-item/update/${data?.id}`,
    method: 'put',
    data
  });
}

export function fetchBatchUpdateDictItemStatus(data: Api.SystemManage.StatusDto) {
  return request({
    url: `/system/dict-item/updateStatus`,
    method: 'put',
    data
  });
}

export function fetchDeleteDictItem(ids?: number[]) {
  return request({
    url: `/system/dict-item`,
    method: 'delete',
    data: {
      ids
    }
  });
}
