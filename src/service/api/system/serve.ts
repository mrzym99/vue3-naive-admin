import { request } from '../../request';

/** get online list */
export function fetchGetServeStat() {
  return request<any>({
    url: '/system/serve',
    method: 'get'
  });
}
