// @unocss-include
import { getRgb } from '@sa/color';
import { $t } from '@/locales';
import { localStg } from '@/utils/storage';
export function setupLoading() {
  const themeColor = localStg.get('themeColor') || '#646cff';

  const { r, g, b } = getRgb(themeColor);

  const primaryColor = `--primary-color: ${r} ${g} ${b}`;

  const loading = `
    <div class="fixed-center flex-col bg-white" style="${primaryColor}">
      <img class="size-72px fly" src="/favicon.svg" />
      <h2 class="fade-in-out text-24px font-500 text-[rgb(var(--primary-color))]">${$t('system.title')}</h2>
    </div>`;

  const app = document.getElementById('app');

  if (app) {
    app.innerHTML = loading;
  }
}
