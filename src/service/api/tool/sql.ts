import { request } from '../../request';

/** get online list */
export function exportSql() {
  return request({
    url: '/tools/sql/export',
    method: 'get',
    responseType: 'blob'
  });
}

export function downloadSql() {
  exportSql().then(res => {
    if (res.data && res.data.size) {
      const blob = new Blob([res.data], { type: 'application/sql' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nest_admin.sql';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  });
}

export function importSql(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return request({
    url: '/tools/sql/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
