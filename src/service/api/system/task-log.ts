import { request } from '../../request';

/** get TaskLog list */
export function fetchGetTaskLogList(params?: Api.SystemManage.TaskLogSearchParams) {
  return request<Api.SystemManage.TaskLogList>({
    url: '/system/log/task/list',
    method: 'get',
    params
  });
}
