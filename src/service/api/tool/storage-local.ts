import { request } from '../../request';

/** get online list */
export function fetchGetStorageLocalList(params?: Api.SystemManage.StorageLocalSearchParams) {
  return request<Api.SystemManage.StorageLocalList>({
    url: '/tools/storage/list',
    method: 'get',
    params
  });
}

export function fetchDeleteStorageLocal(ids: string[]) {
  return request({
    url: '/tools/storage/delete',
    method: 'post',
    data: {
      ids
    }
  });
}
