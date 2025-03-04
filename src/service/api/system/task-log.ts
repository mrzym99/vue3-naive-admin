import { request } from '../../request';

/** get TaskLog list */
export function fetchGetTaskLogList(params?: Api.SystemManage.TaskLogSearchParams) {
  return request<Api.SystemManage.TaskLogList>({
    url: '/system/log/task/list',
    method: 'get',
    params
  });
}

export function fetchBatchDeleteTaskLog(ids: string[]) {
  return request({
    url: '/system/log/task/delete',
    method: 'delete',
    data: {
      ids
    }
  });
}
