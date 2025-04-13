<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchCreateNotice, fetchGetNoticeInfo, fetchUpdateNotice } from '@/service/api';
import { useConfigForm } from '@/hooks/common/config-form';
import { StatusEnum } from '@/constants/enum';
import { useDicts } from '@/hooks/common/dict';
import TinymceEditor from '@/components/common/tinymce';

defineOptions({
  name: 'NoticeOperateDialog'
});

const router = useRouter();
const route = useRoute();

const { dicts } = useDicts(['notice_type']);

const { formRef, validate } = useNaiveForm();

type Model = Partial<Api.SystemManage.Notice>;

const model = ref(createDefaultModel());

const noticeConfigForm = useConfigForm<Model>(() => ({
  name: {
    key: 'name',
    label: $t('page.manage.notice.name'),
    type: 'Input',
    required: true,
    span: 8,
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.notice.name')
    }
  },
  type: {
    key: 'type',
    label: $t('page.manage.notice.type'),
    type: 'Select',
    required: true,
    span: 8,

    props: {
      options: dicts.notice_type,
      placeholder: $t('common.pleaseSelect') + $t('page.manage.notice.type')
    }
  },
  status: {
    key: 'status',
    label: $t('common.status'),
    span: 8,
    type: 'Radio',
    required: true,
    options: [
      {
        label: $t('common.enable'),
        value: StatusEnum.ENABLE
      },
      {
        label: $t('common.disable'),
        value: StatusEnum.DISABLE
      }
    ]
  },
  content: {
    key: 'content',
    label: $t('page.manage.notice.content'),
    type: 'Input',
    span: 24,
    required: true,
    slot: 'value'
  }
}));

function createDefaultModel(): Model {
  return {
    name: '',
    type: 1,
    status: 1,
    content: ''
  };
}

function handleInitModel() {
  model.value = createDefaultModel();

  if (route.query.id) {
    getDetail(route.query.id as any);
  }
}

async function getDetail(id: number) {
  const { error, data } = await fetchGetNoticeInfo(id);
  if (!error) {
    Object.assign(model.value, data);
  }
}

function handleCancel() {
  router.back();
}

async function handleSubmit() {
  await validate();
  const api = route.query.id ? fetchUpdateNotice : fetchCreateNotice;

  const { error } = await api(model.value as any);
  if (!error) {
    const message = route.query.id ? $t('common.updateSuccess') : $t('common.addSuccess');
    window.$message?.success(message);
    handleCancel();
  }
}

onMounted(() => {
  handleInitModel();
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden">
    <div class="flex-1 overflow-auto">
      <NCard
        :title="route.query.id ? $t('page.manage.notice.edit') : $t('page.manage.notice.add')"
        :bordered="false"
        size="small"
        class="flex-1 card-wrapper"
      >
        <ConfigForm ref="formRef" v-model:model="model" :fields="noticeConfigForm">
          <template #value="{ formModel, key }">
            <TinymceEditor
              v-model:value="formModel[key]"
              :init="{
                width: '100%',
                height: 470
              }"
            />
          </template>
        </ConfigForm>
        <div class="flex justify-end">
          <NButton class="mr-2" @click="handleCancel">
            {{ $t('common.cancel') }}
          </NButton>
          <NButton type="primary" @click="handleSubmit">
            {{ $t('common.confirm') }}
          </NButton>
        </div>
      </NCard>
    </div>
  </div>
</template>
