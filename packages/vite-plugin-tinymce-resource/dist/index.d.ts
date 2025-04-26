import type { PluginOption } from 'vite';
type Options = {
    /** Public Dir */
    baseUrl: string;
    /**
     * 要复制的目标文件夹
     *
     * @default: ['skins/content/default', 'skins/ui/oxide', 'skins/ui/oxide-dark']
     */
    destDir?: string | string[];
};
declare const _default: (options: Options) => PluginOption;
export default _default;
