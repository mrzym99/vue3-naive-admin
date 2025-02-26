import { request } from '../../request';

/** get LoginLog list */
export function fetchGetLoginLogList(params?: Api.SystemManage.LoginLogSearchParams) {
  return request<Api.SystemManage.LoginLogList>({
    url: '/system/log/login/list',
    method: 'get',
    params
  });
}
