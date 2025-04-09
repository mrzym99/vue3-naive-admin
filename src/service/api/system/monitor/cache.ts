import { request } from '@/service/request';

export function fetchGetCacheList() {
  return request<Api.SystemManage.CachePrefix[]>({
    url: '/system/cache/getPrefixList',
    method: 'get'
  });
}

export function fetchGetKeysByPrefix(prefix: string) {
  return request<string[]>({
    url: `/system/cache/keys/${prefix}`,
    method: 'get'
  });
}

export function fetchGetCacheValueByKey(key: string) {
  return request<string>({
    url: `/system/cache/value/${key}`,
    method: 'get'
  });
}

export function fetchDeletePrefix(prefix: string) {
  return request({
    url: `/system/cache/clearPrefixCache/${prefix}`,
    method: 'delete'
  });
}

export function fetchDeleteCacheByKey(key: string) {
  return request({
    url: `/system/cache/${key}`,
    method: 'delete'
  });
}

export function deleteAllCache() {
  return request({
    url: '/system/cache/clearCache',
    method: 'delete'
  });
}
