import { request } from '../request';

/** Get user info */
export function upload(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return request<string>({
    url: '/tools/upload',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}
