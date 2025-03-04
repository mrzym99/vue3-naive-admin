import { request } from '../../request';

/** get captcha list */
export function fetchGetCaptchaLogList(params?: Api.SystemManage.CaptchaLogSearchParams) {
  return request<Api.SystemManage.CaptchaLogList>({
    url: '/system/log/captcha/list',
    method: 'get',
    params
  });
}

export function fetchBatchDeleteCaptchaLog(ids: string[]) {
  return request({
    url: '/system/log/captcha/delete',
    method: 'delete',
    data: {
      ids
    }
  });
}
