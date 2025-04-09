import { request } from '@/service/request';

/** get online list */
export function fetchGetOnlineUserList(params?: Api.SystemManage.OnlineUserSearchParams) {
  return request<Api.SystemManage.OnlineUserList>({
    url: '/system/online/list',
    method: 'get',
    params
  });
}

export function fetchKickOnlineUser(data: { tokenId: string }) {
  return request({
    url: '/system/online/kick',
    method: 'post',
    data
  });
}
