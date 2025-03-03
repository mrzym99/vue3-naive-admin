import { computed, ref } from 'vue';
import { useCountDown, useLoading } from '@sa/hooks';
import { $t } from '@/locales';
import { REG_EMAIL } from '@/constants/reg';
import { fetchGetCaptchaEmail } from '@/service/api';

export function useCaptcha() {
  const code = ref('');
  const { loading, startLoading, endLoading } = useLoading();
  const { count, start, stop, isCounting } = useCountDown(60);

  const label = computed(() => {
    let text = $t('page.login.codeLogin.getCode');

    const countingLabel = $t('page.login.codeLogin.reGetCode', { time: count.value });

    if (loading.value) {
      text = '';
    }

    if (isCounting.value) {
      text = countingLabel;
    }

    return text;
  });

  function isEmailValid(email: string) {
    if (email.trim() === '') {
      window.$message?.error?.($t('form.email.required'));

      return false;
    }

    if (!REG_EMAIL.test(email)) {
      window.$message?.error?.($t('form.email.invalid'));

      return false;
    }

    return true;
  }

  async function getCaptcha(email: string) {
    const valid = isEmailValid(email);

    if (!valid || loading.value) {
      return;
    }

    startLoading();
    code.value = '';
    // request
    const { error, data } = await fetchGetCaptchaEmail(email);

    if (error) return;
    code.value = data;
    window.$message?.success?.($t('page.login.codeLogin.sendCodeSuccess'));
    start();

    endLoading();
  }

  return {
    code,
    label,
    start,
    stop,
    isCounting,
    loading,
    getCaptcha
  };
}
