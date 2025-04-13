import { request } from '../../request';

export function fetchGetNoticeList(params?: Api.SystemManage.NoticeSearchParams) {
  return request<Api.SystemManage.NoticeList>({
    url: '/system/notice/list',
    method: 'get',
    params
  });
}

export function fetchNoticeByKey(key: string) {
  return request<string>({
    url: `/system/notice/value/${key}`,
    method: 'get'
  });
}

export function fetchGetNoticeInfo(id?: number) {
  return request<Api.SystemManage.Notice>({
    url: `/system/notice/info/${id}`,
    method: 'get'
  });
}

export function fetchCreateNotice(data?: Api.SystemManage.Notice) {
  return request({
    url: '/system/notice',
    method: 'post',
    data
  });
}

export function fetchUpdateNotice(data?: Api.SystemManage.Notice) {
  return request({
    url: `/system/notice/${data?.id}`,
    method: 'put',
    data
  });
}

export function fetchBatchUpdateNoticeStatus(data: Api.SystemManage.StatusDto) {
  return request({
    url: `/system/notice/updateStatus`,
    method: 'put',
    data
  });
}

export function fetchDeleteNotice(id?: number) {
  return request({
    url: `/system/notice/${id}`,
    method: 'delete'
  });
}

export function fetchGetNoticeCount() {
  return request({
    url: `/system/notice/count`,
    method: 'get'
  });
}
