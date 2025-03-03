<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchCreateDept, fetchGetDeptTree, fetchUpdateDept } from '@/service/api';
import type { ConfigFormArrayType, Option } from '@/components/advanced/config-form/config-form-type';

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

const deptConfigForm = reactive<ConfigFormArrayType>([
  {
    key: 'name',
    label: '部门名称',
    type: 'Input',
    required: true,
    props: {
      maxlength: 20,
      'show-count': true,
      placeholder: '请输入部门名称'
    }
  },
  {
    key: 'order',
    label: '排序',
    type: 'InputNumber',
    props: {
      min: 1,
      max: 9999,
      placeholder: '请输入排序'
    }
  },

  {
    key: 'parentId',
    label: '父级部门',
    type: 'TreeSelect',
    span: 24,
    // tree select 比较特殊 options 可以通过 props 传入
    props: {
      placeholder: '请选择父级部门',
      options: []
    },
    required: false
  },
  {
    key: 'default',
    label: '默认部门',
    type: 'Switch',
    props: {
      'checked-value': 1,
      'unchecked-value': 0
    }
  }
]);

function createDefaultModel(): Model {
  return {
    name: '',
    order: 1,
    default: 0,
    parentId: ''
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
  const api = props.operateType === 'add' ? fetchCreateDept : fetchUpdateDept;

  const { error } = await api(model.value as any);
  if (!error) {
    const message = props.operateType === 'add' ? $t('common.addSuccess') : $t('common.updateSuccess');
    window.$message?.success(message);
    closeDrawer();
    emit('submitted');
  }
}

function mapTree(tree: Api.SystemManage.DeptTree, deep: number = 0): Option[] {
  return tree.map(item => {
    const { children } = item;
    return {
      label: item.name,
      value: item.id,
      key: item.id,
      disabled: deep > 0,
      isLeaf: !children || children.length === 0,
      children: children ? mapTree(children, deep + 1) : []
    };
  });
}

async function getDeptTree() {
  const { data, error } = await fetchGetDeptTree();
  if (!error) {
    deptConfigForm[2]!.props!.options = mapTree(data);
  }
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    getDeptTree();
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
