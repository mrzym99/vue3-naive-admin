import { request } from '../../request';

/** get serve */
export function fetchGetServeStat() {
  return request<any>({
    url: '/system/serve',
    method: 'get'
  });
}
