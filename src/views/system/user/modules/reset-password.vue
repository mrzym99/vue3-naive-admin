<script setup lang="ts">
import { ref, watch } from 'vue';
import type { FormInst, FormItemRule } from 'naive-ui';
import { fetchResetPassword } from '@/service/api';
import { $t, getLocale } from '@/locales';
import { REG_PWD } from '@/constants/reg';

interface Emits {
  (e: 'change'): void;
  (e: 'update:showModal', value: boolean): void;
}

const props = defineProps<{
  showModal: boolean;
  resetId: number | null;
  title: string;
}>();
const emit = defineEmits<Emits>();
const formRef = ref<null | FormInst>(null);
const formValue = ref({
  password: ''
});
const localShowModal = ref(props.showModal);

watch(
  () => props.showModal,
  val => {
    localShowModal.value = val;
  }
);

watch(localShowModal, val => {
  emit('update:showModal', val);
  formValue.value.password = '';
});

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

const handleValidateClick = async (e: MouseEvent) => {
  e.preventDefault();
  await formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      const { error } = await fetchResetPassword(props.resetId, {
        password: formValue.value.password
      });
      if (!error) {
        window.$message?.success($t('common.operateSuccess'));
        emit('change');
        localShowModal.value = false;
      }
    }
  });
};
</script>

<template>
  <NModal v-model:show="localShowModal" class="w-130!" preset="dialog" :title="title" @close="localShowModal = false">
    <NForm ref="formRef" inline class="mt5" :model="formValue" :rules="rules" size="small">
      <NFormItem label="重置密码" path="password">
        <NInput v-model:value="formValue.password" type="password" placeholder="请输入重置后密码" />
      </NFormItem>
      <NFormItem>
        <NButton attr-type="button" @click="handleValidateClick">
          {{ title }}
        </NButton>
      </NFormItem>
    </NForm>
  </NModal>
</template>
