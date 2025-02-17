import { request } from '../../request';

export function fetchGetDeptTree(name?: string) {
  return request<any[]>({
    url: '/system/dept/list',
    method: 'get',
    params: {
      name
    }
  });
}
