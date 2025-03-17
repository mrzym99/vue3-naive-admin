<script setup lang="tsx">
import { computed, reactive, ref } from 'vue';
import type { FormInst } from 'naive-ui';
import { $t, getLocale } from '@/locales';
import { fetchUpdateAccountPassword } from '@/service/api';
import { useAuthStore } from '@/store/modules/auth';
import { useFormRules } from '@/hooks/common/form';

type PasswordModel = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const { userInfo } = useAuthStore();
const model = reactive<PasswordModel>(createDefaultModel());
const loading = ref(false);
const formRef = ref<FormInst | null>(null);
function createDefaultModel(): PasswordModel {
  return {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
}

const rules = computed<Record<keyof PasswordModel, App.Global.FormRule[]>>(() => {
  const { formRules, createConfirmNewPwdRule } = useFormRules();

  return {
    oldPassword: formRules.pwd,
    newPassword: formRules.pwd,
    confirmPassword: createConfirmNewPwdRule(model.newPassword)
  };
});

const computedLabelWidth = computed(() => {
  if (getLocale.value === 'zh-CN') {
    return 120;
  }
  return 150;
});

const handleSubmit = async () => {
  await formRef.value?.validate();
  loading.value = true;
  const { error } = await fetchUpdateAccountPassword(model);
  loading.value = false;
  if (!error) {
    window.$message?.success($t('common.modifySuccess'));
  }
};

const isSuperAdmin = computed(() => {
  return userInfo.roles.includes('super-admin');
});
</script>

<template>
  <NForm
    ref="formRef"
    class="w-60%"
    :model="model"
    :rules="rules"
    v-bind="$attrs"
    label-placement="left"
    :label-width="computedLabelWidth"
    require-mark-placement="right"
  >
    <NGrid responsive="screen" item-responsive :x-gap="16">
      <NFormItemGi :span="24" :label="$t('page.password.oldPwd')" path="oldPassword">
        <NInput
          v-model:value="model.oldPassword"
          type="password"
          show-password-on="click"
          :placeholder="$t('common.pleaseEnter') + $t('page.password.oldPwd')"
        />
      </NFormItemGi>
      <NFormItemGi :span="24" :label="$t('page.password.newPwd')" path="newPassword">
        <NInput
          v-model:value="model.newPassword"
          type="password"
          show-password-on="click"
          :placeholder="$t('common.pleaseEnter') + $t('page.password.newPwd')"
        />
      </NFormItemGi>
      <NFormItemGi :span="24" :label="$t('page.password.confirmNewPwd')" path="confirmPassword">
        <NInput
          v-model:value="model.confirmPassword"
          show-password-on="click"
          type="password"
          :placeholder="$t('page.password.pleaseTwice')"
        />
      </NFormItemGi>
    </NGrid>
    <div v-if="!isSuperAdmin" class="w-full flex justify-end">
      <NPopconfirm @positive-click="handleSubmit">
        <template #trigger>
          <NButton type="primary" :loading="loading">
            {{ $t('common.modify') }}
          </NButton>
        </template>
        {{ $t('common.modify') }}
      </NPopconfirm>
    </div>
  </NForm>
</template>
