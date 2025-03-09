<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { $t } from '@/locales';
import { loginModuleRecord } from '@/constants/app';
import { useRouterPush } from '@/hooks/common/router';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useAuthStore } from '@/store/modules/auth';
import { fetchGetCaptchaImg } from '@/service/api';

defineOptions({
  name: 'PwdLogin'
});

const authStore = useAuthStore();
const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useNaiveForm();
const captchaId = ref<string>('');
const captchaImg = ref<string>('');
const captchaLoading = ref<boolean>(false);

interface FormModel {
  username: string;
  password: string;
  code: string;
}

const model: FormModel = reactive({
  username: 'admin',
  password: '123456',
  code: ''
});

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  // inside computed to make locale reactive, if not apply i18n, you can define it without computed
  const { formRules } = useFormRules();

  return {
    username: formRules.username,
    password: formRules.pwd,
    code: formRules.code
  };
});

async function handleSubmit() {
  await validate();
  const loginData: Api.Auth.LoginDto = {
    ...model,
    captchaId: captchaId.value
  };
  await authStore.login(loginData);
}

type AccountKey = 'admin' | 'user' | 'guest';
interface Account {
  key: AccountKey;
  label: string;
  username: string;
  password: string;
  type?: string;
}

const accounts = computed<Account[]>(() => [
  {
    key: 'admin',
    label: '管理员',
    username: 'admin',
    password: '123456'
  },
  {
    key: 'user',
    label: '测试',
    username: 'test',
    password: '123456'
  },
  {
    key: 'guest',
    label: '游客',
    username: 'guest',
    password: '123456'
  }
]);

async function handleAccountLogin(account: Account) {
  const acc: Api.Auth.LoginDto = {
    username: account.username,
    password: account.password,
    code: model.code,
    captchaId: captchaId.value
  };
  await authStore.login(acc);
}

async function getCaptcha() {
  captchaLoading.value = true;
  const { data, error } = await fetchGetCaptchaImg(120, 40);
  captchaLoading.value = false;
  if (error) {
    return;
  }
  const { img, id } = data;
  captchaImg.value = img;
  captchaId.value = id;
}

onMounted(() => {
  getCaptcha();
});
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit">
    <NFormItem path="username">
      <NInput v-model:value="model.username" :placeholder="$t('page.login.common.usernamePlaceholder')" />
    </NFormItem>
    <NFormItem path="password">
      <NInput
        v-model:value="model.password"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
      />
    </NFormItem>
    <NFormItem path="code">
      <div class="w-full flex items-center justify-between">
        <NInput v-model:value="model.code" :placeholder="$t('page.login.codeLogin.imageCodePlaceholder')" />
        <NSpin class="ml-10px h-40px w-120px" :show="captchaLoading">
          <NImage
            class="cursur-pointer h-40px max-w-120px w-120px rounded-sm"
            :src="captchaImg"
            alt="Captcha"
            preview-disabled
            @click="getCaptcha"
          >
            <template #error>
              <div class="h-40px w-120px flex-center text-#666">
                <icon-mdi-image-off-outline class="text-icon" />
                Captcha Error
              </div>
            </template>
          </NImage>
        </NSpin>
      </div>
    </NFormItem>
    <NSpace vertical :size="24">
      <div class="flex-y-center justify-between">
        <NCheckbox>{{ $t('page.login.pwdLogin.rememberMe') }}</NCheckbox>
        <NButton quaternary @click="toggleLoginModule('reset-pwd')">
          {{ $t('page.login.pwdLogin.forgetPassword') }}
        </NButton>
      </div>
      <NButton type="primary" size="large" round block :loading="authStore.loginLoading" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </NButton>
      <div class="flex-y-center justify-between gap-12px">
        <!--
 <NButton class="flex-1" block @click="toggleLoginModule('code-login')">
          {{ $t(loginModuleRecord['code-login']) }}
        </NButton> 
-->
        <NButton class="flex-1" block @click="toggleLoginModule('super-login')">
          {{ $t(loginModuleRecord['super-login']) }}
        </NButton>
        <NButton class="flex-1" block @click="toggleLoginModule('register')">
          {{ $t(loginModuleRecord.register) }}
        </NButton>
      </div>
      <NDivider class="text-14px text-#666 !m-0">{{ $t('page.login.pwdLogin.otherAccountLogin') }}</NDivider>
      <div class="flex-center gap-12px">
        <NButton v-for="item in accounts" :key="item.key" type="primary" @click="handleAccountLogin(item)">
          {{ item.label }}
        </NButton>
      </div>
    </NSpace>
  </NForm>
</template>

<style scoped></style>
