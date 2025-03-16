<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { VAceEditor } from 'vue3-ace-editor'; // https://github.com/CarterLi/vue3-ace-editor
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchCreateTask, fetchUpdateTask } from '@/service/api';
import type { ConfigFormObjectType } from '@/components/advanced/config-form';
import { StatusEnum, TaskTypeEnum } from '@/constants/enum';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-chrome';

defineOptions({
  name: 'TaskOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.Task | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.manage.task.add'),
    edit: $t('page.manage.task.edit')
  };
  return titles[props.operateType];
});

type Model = Partial<Api.SystemManage.Task>;

const model = ref(createDefaultModel());

const taskConfigForm: ConfigFormObjectType<Api.SystemManage.TaskSearchParams> = reactive({
  type: {
    key: 'type',
    label: $t('page.manage.task.taskType'),
    type: 'Radio',
    span: 24,
    required: true,
    options: [
      {
        label: $t('page.manage.task.cron'),
        value: TaskTypeEnum.CRON
      },
      {
        label: $t('page.manage.task.interval'),
        value: TaskTypeEnum.INTERVAL
      }
    ]
  },
  name: {
    key: 'name',
    label: $t('page.manage.task.name'),
    type: 'Input',
    span: 24,
    required: true,
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.task.name')
    }
  },
  service: {
    key: 'service',
    label: $t('page.manage.task.service'),
    type: 'Input',
    span: 24,
    required: true,
    props: {
      placeholder: $t('page.manage.task.service')
    }
  },
  limit: {
    key: 'limit',
    label: $t('page.manage.task.limit'),
    type: 'InputNumber',
    props: {
      min: -1,
      placeholder: $t('page.manage.task.limit')
    }
  },
  cron: {
    key: 'cron',
    label: $t('page.manage.task.cron'),
    type: 'Input',
    span: 24,
    hide: () => {
      return model.value.type !== TaskTypeEnum.CRON;
    },
    props: {
      placeholder: $t('page.manage.task.cron')
    }
  },
  every: {
    key: 'every',
    label: $t('page.manage.task.interval'),
    type: 'InputNumber',
    hide: () => {
      return model.value.type === TaskTypeEnum.CRON;
    },
    props: {
      min: 100,
      placeholder: $t('page.manage.task.interval')
    }
  },
  startTime: {
    key: 'startTime',
    label: $t('page.manage.task.startTime'),
    type: 'DatePicker',
    hide: () => {
      return model.value.type === TaskTypeEnum.CRON;
    },
    props: {
      type: 'datetime'
    }
  },
  endTime: {
    key: 'endTime',
    label: $t('page.manage.task.endTime'),
    type: 'DatePicker',
    hide: () => {
      return model.value.type === TaskTypeEnum.CRON;
    },
    props: {
      type: 'datetime'
    }
  },
  data: {
    key: 'data',
    label: $t('page.manage.task.params'),
    type: 'Input',
    span: 24,
    slot: 'data'
  },
  status: {
    key: 'status',
    label: $t('common.status'),
    type: 'Radio',
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
  remark: {
    key: 'remark',
    label: $t('page.manage.common.remark'),
    type: 'Input',
    span: 24,
    props: {
      type: 'textarea',
      placeholder: $t('common.pleaseEnter') + $t('page.manage.common.remark')
    }
  }
});

function createDefaultModel(): Model {
  return {
    type: 0,
    name: '',
    service: '',
    data: '',
    limit: -1,
    cron: '',
    every: 60000,
    startTime: null,
    endTime: null,
    status: 1,
    remark: ''
  };
}

function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  const api = props.operateType === 'add' ? fetchCreateTask : fetchUpdateTask;

  const { error } = await api(model.value as any);
  if (!error) {
    const message = props.operateType === 'add' ? $t('common.addSuccess') : $t('common.updateSuccess');
    window.$message?.success(message);
    closeDrawer();
    emit('submitted');
  }
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    nextTick(() => {
      restoreValidation();
    });
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" width="50%">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <ConfigForm ref="formRef" v-model:model="model" :fields="taskConfigForm">
        <template #data="{ formModel, key }">
          <VAceEditor v-model:value="formModel[key]" class="h-200px w-full" lang="json" theme="chrome" />
        </template>
      </ConfigForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
