import { request } from '../../request';

/** get online list */
export function fetchGetStorageOssList(params?: Api.ToolsManage.StorageOssSearchParams) {
  return request<Api.ToolsManage.StorageOssList>({
    url: '/tools/oss/list',
    method: 'get',
    params
  });
}
