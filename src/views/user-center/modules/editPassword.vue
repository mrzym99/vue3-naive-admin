<script setup lang="tsx">
import { computed, reactive, ref } from 'vue';
import { type FormInst, useDialog } from 'naive-ui';
import { $t, getLocale } from '@/locales';
import { fetchUpdateAccountPassword } from '@/service/api';
import { useLogout } from '@/service/request/shared';
import { useFormRules } from '@/hooks/common/form';

type PasswordModel = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const { logoutAndCleanup } = useLogout();
const model = reactive<PasswordModel>(createDefaultModel());
const loading = ref(false);
const formRef = ref<FormInst | null>(null);
const dialog = useDialog();
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
  loading.value = true;
  const { error } = await fetchUpdateAccountPassword(model);
  loading.value = false;
  if (!error) {
    window.$message?.success($t('common.modifySuccess'));
    window.$dialog?.error({
      title: $t('common.error'),
      content: $t('request.logoutWithModalMsg'),
      positiveText: $t('common.confirm'),
      maskClosable: false,
      closeOnEsc: false,
      onPositiveClick() {
        logoutAndCleanup();
      },
      onClose() {
        logoutAndCleanup();
      }
    });
  }
};

const handleConfirm = async () => {
  await formRef.value?.validate();
  dialog.info({
    title: $t('common.tip'),
    content: $t('common.confirmModify'),
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    onPositiveClick: () => {
      handleSubmit();
    }
  });
};
</script>

<template>
  <NForm
    ref="formRef"
    class="w-60% lt-sm:w-100%"
    :model="model"
    :rules="rules"
    v-bind="$attrs"
    label-placement="left"
    :label-width="computedLabelWidth"
    require-mark-placement="right"
  >
    <NGrid responsive="screen" item-responsive>
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
    <NSpace justify="end">
      <NButton type="primary" :loading="loading" @click="handleConfirm">
        {{ $t('common.modify') }}
      </NButton>
    </NSpace>
  </NForm>
</template>
