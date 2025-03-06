// vite.config.js
import type { Plugin } from 'vite';
import viteCompression from 'vite-plugin-compression';

export function setUpCompression() {
  const plugin: Plugin = viteCompression({
    verbose: true, // 在控制台输出更多信息
    disable: false, // 是否禁用插件
    deleteOriginFile: false, // 是否删除源文件
    threshold: 10240, // 体积大于 threshold 的文件会被压缩，单位是 bytes
    algorithm: 'gzip', // 使用 gzip 压缩
    ext: '.gz' // 生成的压缩包后缀
  });

  return plugin;
}
