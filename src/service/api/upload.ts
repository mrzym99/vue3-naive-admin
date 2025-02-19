import { request } from '../request';

/** Get user info */
export function upload(file: File) {
  const data = new FormData();
  data.append('file', file);
  return request<any>({ url: '/upload', method: 'post', data });
}
