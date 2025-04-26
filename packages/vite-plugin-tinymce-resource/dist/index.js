import { cp, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
const require = createRequire(import.meta.url);
const tinymceDir = dirname(require.resolve('tinymce'));
let outDir;
let base;
const defaultDestDir = ['skins/content/default', 'skins/ui/oxide', 'skins/ui/oxide-dark'];
export default (options) => {
    const { baseUrl, destDir = defaultDestDir } = options;
    return {
        name: 'vite-plugin-tinymce-resource',
        configResolved(config) {
            outDir = config.build.outDir;
            base = config.base;
        },
        configureServer(server) {
            // eslint-disable-next-line consistent-return
            server.middlewares.use(async (req, res, next) => {
                const urlPrefix = `${base}/${baseUrl}`.replace(/\/{2,}/, '/');
                if (!req.url?.startsWith(urlPrefix)) {
                    return next();
                }
                try {
                    const url = resolve(tinymceDir, req.url.replace(urlPrefix, ''));
                    const content = await readFile(url);
                    res.setHeader('Content-Type', 'text/css');
                    res.end(content);
                }
                catch (error) {
                    console.error(error);
                    res.statusCode = 500;
                    res.end(error.toString());
                }
            });
        },
        async closeBundle() {
            Array()
                .concat(destDir)
                .forEach(async (dir) => {
                const sourceDir = resolve(tinymceDir, dir);
                const destinationDir = resolve(outDir, `./${baseUrl}`, dir);
                // console.log(sourceDir);
                // console.log(destinationDir);
                try {
                    await cp(sourceDir, destinationDir, { recursive: true, force: true });
                }
                catch (error) {
                    console.error('[@admin-pkg/vite-plugin-tinymce-resource]: ', error);
                }
            });
        }
    };
};
