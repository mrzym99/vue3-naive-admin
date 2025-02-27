import { request } from '../../request';

/** get captcha list */
export function fetchGetCaptchaLogList(params?: Api.SystemManage.CaptchaLogSearchParams) {
  return request<Api.SystemManage.CaptchaLogList>({
    url: '/system/log/captcha/list',
    method: 'get',
    params
  });
}
