<script setup lang="tsx">
import type { FormRules } from 'naive-ui';
import { NButton } from 'naive-ui';
import { reactive, ref } from 'vue';
import TinymceEditor from '@/components/common/tinymce/index.vue';
import { fetchSendEmail } from '@/service/api';
import { useNaiveForm } from '@/hooks/common/form';
import { REG_EMAIL } from '@/constants/reg';

const createDefaultModel = () => {
  return {
    subject: '',
    content: '',
    to: ''
  };
};

const model = ref(createDefaultModel());
const loading = ref(false);

const rules = reactive<FormRules>({
  subject: {
    type: 'string',
    required: true,
    message: '请输入邮件主题',
    trigger: 'blur'
  },
  to: {
    type: 'string',
    required: true,
    pattern: REG_EMAIL,
    message: '请输入正确的收件人邮箱',
    trigger: 'blur'
  },
  content: {
    type: 'string',
    required: true,
    message: '请输入邮件内容',
    trigger: 'blur'
  }
});

const { formRef, validate, restoreValidation } = useNaiveForm();

function resetModel() {
  Object.assign(model.value, createDefaultModel());
  restoreValidation();
}
async function handleSend() {
  await validate();
  loading.value = true;
  const { error } = await fetchSendEmail(model.value);
  loading.value = false;
  if (!error) {
    window.$message?.success('发送成功');
    resetModel();
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-auto">
    <NCard :bordered="false" size="small" class="flex-1-auto card-wrapper">
      <NSpin :show="loading">
        <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" label-align="left" label-width="80">
          <NFormItem key="to" path="to" label="收件人">
            <NInput v-model:value="model.to" :disabled="loading" placeholder="请输入收件人" />
          </NFormItem>
          <NFormItem key="subject" path="subject" label="邮件主题">
            <NInput v-model:value="model.subject" :disabled="loading" placeholder="请输入邮件主题" />
          </NFormItem>
          <NFormItem key="content" path="content" label="正文">
            <TinymceEditor
              v-model:value="model.content"
              :init="{
                width: '100%',
                height: 320
              }"
            />
          </NFormItem>
        </NForm>
      </NSpin>
      <NSpace class="w-full" justify="end">
        <NButton type="primary" :loading="loading" @click="handleSend">发送邮件</NButton>
      </NSpace>
    </NCard>
  </div>
</template>

<style scoped lang="scss"></style>
