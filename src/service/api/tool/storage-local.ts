import { request } from '../../request';

/** get online list */
export function fetchGetStorageLocalList(params?: Api.ToolsManage.StorageLocalSearchParams) {
  return request<Api.ToolsManage.StorageLocalList>({
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
