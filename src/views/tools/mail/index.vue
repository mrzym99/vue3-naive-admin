<script setup lang="tsx">
import type { FormRules } from 'naive-ui';
import { NButton } from 'naive-ui';
import { reactive, ref } from 'vue';
import TinymceEditor from '@/components/common/tinymce/index.vue';
import { fetchSendEmail } from '@/service/api';
import { useNaiveForm } from '@/hooks/common/form';
import { REG_EMAIL } from '@/constants/reg';
import { useAuth } from '@/hooks/business/auth';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';

const { hasAuth } = useAuth();
const appStore = useAppStore();
const createDefaultModel = () => {
  return {
    subject: '',
    content: '',
    to: ''
  };
};

const model = ref<Api.ToolsManage.Mail>(createDefaultModel());
const loading = ref(false);

const rules = reactive<FormRules>({
  subject: {
    type: 'string',
    required: true,
    message: $t('common.pleaseEnter') + $t('page.tools.mail.subject'),
    trigger: 'blur'
  },
  to: {
    type: 'string',
    required: true,
    pattern: REG_EMAIL,
    message: $t('page.tools.mail.pleaseEnterCorrectEmail'),
    trigger: 'blur'
  },
  content: {
    type: 'string',
    required: true,
    message: $t('common.pleaseEnter') + $t('page.tools.mail.content'),
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
    window.$message?.success($t('page.tools.mail.sendSuccess'));
    resetModel();
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-auto">
    <NCard :bordered="false" size="small" class="flex-1 card-wrapper">
      <NSpin :show="loading">
        <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" label-align="left" label-width="80">
          <NFormItem key="to" path="to" :label="$t('page.tools.mail.to')">
            <NInput v-model:value="model.to" :disabled="loading" :placeholder="$t('page.tools.mail.toPlaceholder')" />
          </NFormItem>
          <NFormItem key="subject" path="subject" :label="$t('page.tools.mail.subject')">
            <NInput
              v-model:value="model.subject"
              :disabled="loading"
              :placeholder="$t('page.tools.mail.subjectPlaceholder')"
            />
          </NFormItem>
          <NFormItem key="content" path="content" :label="$t('page.tools.mail.content')">
            <NInput
              v-if="appStore.isMobile"
              v-model:value="model.content"
              type="textarea"
              show-count
              :rows="6"
            ></NInput>
            <TinymceEditor
              v-else
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
        <NButton :disabled="!hasAuth('tool:mail:send')" type="primary" :loading="loading" @click="handleSend">
          {{ $t('page.tools.mail.send') }}
        </NButton>
      </NSpace>
    </NCard>
  </div>
</template>

<style scoped lang="scss"></style>
