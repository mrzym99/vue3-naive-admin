<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { VAceEditor } from 'vue3-ace-editor';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchCreateParameter, fetchUpdateParameter } from '@/service/api';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-chrome';
import { useConfigForm } from '@/hooks/common/config-form';

defineOptions({
  name: 'ParameterOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.Parameter | null;
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
    add: $t('page.manage.parameter.addParameter'),
    edit: $t('page.manage.parameter.editParameter')
  };
  return titles[props.operateType];
});

type Model = Partial<Api.SystemManage.Parameter>;

const model = ref(createDefaultModel());

const parameterConfigForm = useConfigForm<Model>(() => ({
  name: {
    key: 'name',
    label: '参数名称',
    type: 'Input',
    required: true,
    props: {
      placeholder: '请输入参数名称'
    }
  },
  key: {
    key: 'key',
    label: 'Key',
    type: 'Input',
    required: true,
    props: {
      placeholder: '请输入Key'
    }
  },
  value: {
    key: 'value',
    label: '参数值',
    span: 24,
    type: 'Input',
    slot: 'value',
    required: true
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
}));

function createDefaultModel(): Model {
  return {
    name: '',
    key: '',
    value: '',
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
  const api = props.operateType === 'add' ? fetchCreateParameter : fetchUpdateParameter;

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
      <ConfigForm ref="formRef" v-model:model="model" :fields="parameterConfigForm">
        <template #value="{ formModel, key }">
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
