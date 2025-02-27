<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchCreateTask, fetchUpdateTask } from '@/service/api';
import type { ConfigFormObjectType } from '@/components/advanced/config-form';
import { StatusEnum, TaskTypeEnum } from '@/constants/enum';

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
    add: $t('page.manage.task.addTask'),
    edit: $t('page.manage.task.editTask')
  };
  return titles[props.operateType];
});

type Model = Partial<Api.SystemManage.Task>;

const model = ref(createDefaultModel());

const taskConfigForm: ConfigFormObjectType<Api.SystemManage.Task> = reactive({
  type: {
    key: 'type',
    label: '类型',
    type: 'Radio',
    span: 24,
    required: true,
    options: [
      {
        label: 'Cron',
        value: TaskTypeEnum.CRON
      },
      {
        label: '时间间隔',
        value: TaskTypeEnum.INTERVAL
      }
    ]
  },
  name: {
    key: 'name',
    label: '任务名称',
    type: 'Input',
    span: 24,
    required: true,
    props: {
      placeholder: '请输入任务名称'
    }
  },
  service: {
    key: 'service',
    label: '服务路径',
    type: 'Input',
    span: 24,
    required: true,
    props: {
      placeholder: '请输入服务路径'
    }
  },
  data: {
    key: 'data',
    label: '任务参数',
    type: 'Input',
    span: 24,
    props: {
      type: 'textarea',
      placeholder: '请输入任务参数'
    }
  },
  limit: {
    key: 'limit',
    label: '执行次数',
    type: 'InputNumber',
    props: {
      min: -1,
      placeholder: '请输入执行次数'
    }
  },
  cron: {
    key: 'cron',
    label: 'Cron 表达式',
    type: 'Input',
    span: 24,
    hide: () => {
      return model.value.type !== TaskTypeEnum.CRON;
    },
    props: {
      type: 'textarea',
      placeholder: '请输入Cron 表达式'
    }
  },
  every: {
    key: 'every',
    label: '执行间隔',
    type: 'InputNumber',
    hide: () => {
      return model.value.type === TaskTypeEnum.CRON;
    },
    props: {
      min: 100,
      placeholder: '请输入执行间隔'
    }
  },
  startTime: {
    key: 'startTime',
    label: '开始时间',
    type: 'DatePicker',
    hide: () => {
      return model.value.type === TaskTypeEnum.CRON;
    },
    props: {}
  },
  endTime: {
    key: 'endTime',
    label: '结束时间',
    type: 'DatePicker',
    hide: () => {
      return model.value.type === TaskTypeEnum.CRON;
    },
    props: {}
  },
  status: {
    key: 'status',
    label: '状态',
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
    label: '备注',
    type: 'Input',
    span: 24,
    props: {
      type: 'textarea',
      placeholder: '请输入备注'
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
  <NDrawer v-model:show="visible" display-directive="show" width="40%">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <ConfigForm ref="formRef" v-model:model="model" :fields="taskConfigForm" />
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
