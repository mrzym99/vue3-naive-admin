<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchCheckHasRegister, fetchGetTokenTypeAndToken } from '@/service/api';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useAuthStore } from '@/store/modules/auth';
import { useRouterPush } from '@/hooks/common/router';

defineOptions({
  name: 'GithubLogin'
});

interface FormModel {
  type: string;
  token_type: string;
  access_token: string;
  username: string;
  password: string;
  confirmPassword: string;
  from: string;
  uniqueId: string;
  avatar: string;
  address: string;
  nickName: string;
}

const authStore = useAuthStore();
const { toggleLoginModule } = useRouterPush();

const model: FormModel = reactive({
  type: 'github',
  token_type: '',
  access_token: '',
  username: '',
  password: '',
  confirmPassword: '',
  from: 'github',
  uniqueId: '',
  avatar: '',
  address: '',
  nickName: ''
});
const code = ref<string | null>(null);
const needRegister = ref(false);
const { formRef, validate } = useNaiveForm();
const rules = computed(() => {
  // inside computed to make locale reactive, if not apply i18n, you can define it without computed
  const { formRules, createConfirmPwdRule } = useFormRules();

  return {
    username: formRules.username,
    password: formRules.pwd,
    confirmPassword: createConfirmPwdRule(model.password)
  };
});

function getCode() {
  const route = useRoute();
  if (route.query.code) {
    code.value = route.query.code as string;
  } else {
    window?.$message?.error('获取第三方登录码失败');
  }
}

const thirdLogin = async () => {
  if (!code.value) return;
  const { error, data } = await fetchGetTokenTypeAndToken({
    type: 'github',
    code: code.value
  });
  if (!error) {
    const { token_type, access_token } = data;
    model.token_type = token_type;
    model.access_token = access_token;
  }
  const { error: checkError, data: userData } = await fetchCheckHasRegister(model);

  if (!checkError) {
    const { userInfo, githubUserInfo } = userData;
    if (userInfo) {
      model.uniqueId = userInfo.uniqueId;
      await authStore.thirdLogin(model);
    } else {
      model.username = githubUserInfo.name;
      model.uniqueId = githubUserInfo.id;
      model.avatar = githubUserInfo.avatar_url;
      model.address = githubUserInfo.location;
      model.nickName = githubUserInfo.name;
      needRegister.value = true;
    }
  }
};

async function handleSubmit() {
  await validate();
  await authStore.thirdLogin(model);
}

onMounted(() => {
  getCode();
  thirdLogin();
});
</script>

<template>
  <div>
    <div v-if="!needRegister" class="my-5 flex flex-col items-center justify-center">
      <img class="swim size-108px" src="/favicon.svg" />
      <div class="mt-5 text-lg text-primary">{{ $t('page.login.githubLogin.loading') }}</div>
    </div>
    <NForm
      v-else
      ref="formRef"
      :model="model"
      :rules="rules"
      size="large"
      :show-label="false"
      @keyup.enter="handleSubmit"
    >
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
      <NFormItem path="confirmPassword">
        <NInput
          v-model:value="model.confirmPassword"
          type="password"
          show-password-on="click"
          :placeholder="$t('page.login.common.confirmPasswordPlaceholder')"
        />
      </NFormItem>
      <NSpace vertical :size="18" class="w-full">
        <NButton :loading="authStore.loginLoading" type="primary" size="large" round block @click="handleSubmit">
          {{ $t('common.confirm') }}
        </NButton>
        <NButton size="large" round block @click="toggleLoginModule('pwd-login')">
          {{ $t('page.login.common.back') }}
        </NButton>
      </NSpace>
    </NForm>
  </div>
</template>

<style scoped></style>
