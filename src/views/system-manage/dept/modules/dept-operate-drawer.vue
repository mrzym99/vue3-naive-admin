<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchCreateDept, fetchUpdateDept } from '@/service/api';

defineOptions({
  name: 'DeptOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.Dept | null;
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
    add: $t('page.manage.dept.addDept'),
    edit: $t('page.manage.dept.editDept')
  };
  return titles[props.operateType];
});

type Model = Partial<Api.SystemManage.Dept>;

const model = ref(createDefaultModel());

const deptConfigForm: Form.ConfigForm = [
  {
    key: 'name',
    label: '部门名称',
    type: 'input',
    placeholder: '请输入部门名称'
  },
  {
    key: 'order',
    label: '排序',
    type: 'input',
    placeholder: '请输入排序'
  },
  {
    key: 'parentId',
    label: '父级部门',
    type: 'select',
    placeholder: '请选择父级部门',
    required: false,
    options: []
  }
];

function createDefaultModel(): Model {
  return {
    name: '',
    order: null
  };
}

function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, props.rowData);
  }
}

async function addOrEditDept() {
  const api = props.operateType === 'add' ? fetchCreateDept : fetchUpdateDept;

  const { error } = await api(model.value as any);
  if (!error) {
    const message = props.operateType === 'add' ? $t('common.addSuccess') : $t('common.updateSuccess');
    window.$message?.success(message);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  await addOrEditDept();
  // request
  closeDrawer();
  emit('submitted');
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
      <ConfigForm ref="formRef" v-model:model="model" :fields="deptConfigForm" />
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
