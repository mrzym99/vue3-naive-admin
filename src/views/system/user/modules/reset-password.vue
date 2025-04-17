<script setup lang="ts">
import { ref, watch } from 'vue';
import type { FormInst, FormItemRule } from 'naive-ui';
import { fetchResetPassword } from '@/service/api';
import { $t, getLocale } from '@/locales';
import { REG_PWD } from '@/constants/reg';

interface Emits {
  (e: 'change'): void;
  (e: 'update:show', value: boolean): void;
}

const props = defineProps<{
  show: boolean;
  resetId: number | null;
  title: string;
}>();
const emit = defineEmits<Emits>();
const formRef = ref<null | FormInst>(null);
const formValue = ref({
  password: '123456'
});
const localShowModal = ref(props.show);

watch(
  () => props.show,
  val => {
    localShowModal.value = val;
  }
);

const rules = {
  password: {
    required: true,
    validator(_rule: FormItemRule, value: string) {
      if (!value) {
        return new Error(getLocale.value === 'zh-CN' ? '密码必填' : 'password is Required');
      } else if (!REG_PWD.test(value)) {
        return new Error($t('form.pwd.invalid'));
      }
      return true;
    },
    trigger: ['input', 'blur']
  }
};

const handleValidateClick = async () => {
  await formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      const { error } = await fetchResetPassword(props.resetId, {
        password: formValue.value.password
      });
      if (!error) {
        window.$message?.success($t('common.operateSuccess'));
        emit('change');
        emit('update:show', false);
        localShowModal.value = false;
      }
    }
  });
};
</script>

<template>
  <NModal
    v-model:show="localShowModal"
    class="w-100!"
    preset="dialog"
    :title="title"
    positive-text="确定"
    negative-text="取消"
    :on-positive-click="handleValidateClick"
    :on-close="() => (localShowModal = false)"
    :on-negative-click="() => (localShowModal = false)"
  >
    <NForm ref="formRef" class="mt5" :model="formValue" :rules="rules">
      <NFormItem :label="$t('page.manage.user.resetPassword')" path="password">
        <NInput
          v-model:value="formValue.password"
          show-password-on="click"
          auto-focus
          clearable
          type="password"
          :placeholder="$t('page.login.common.passwordPlaceholder')"
        />
      </NFormItem>
    </NForm>
  </NModal>
</template>
