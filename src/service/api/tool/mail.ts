import { request } from '../../request';

/** get online list */
export function fetchSendEmail(data?: Api.ToolsManage.Mail) {
  return request<Api.ToolsManage.StorageLocalList>({
    url: '/tools/mail/send',
    method: 'post',
    data
  });
}
