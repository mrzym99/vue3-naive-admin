import { request } from '../../request';

/** get online list */
export function fetchGetStorageOssList(params?: Api.SystemManage.StorageOssSearchParams) {
  return request<Api.SystemManage.StorageOssList>({
    url: '/tools/oss/list',
    method: 'get',
    params
  });
}
