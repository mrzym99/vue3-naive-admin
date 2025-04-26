import { request } from '../../request';

/** get online list */
export function fetchPay(data?: Api.ToolsManage.PayOrder) {
  return request<string>({
    url: '/tools/pay/pay',
    method: 'post',
    data
  });
}

export function fetchCheck(id: number) {
  return request<boolean>({
    url: `/tools/pay/verify/${id}`,
    method: 'post'
  });
}
