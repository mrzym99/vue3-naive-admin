<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchCreateDept, fetchGetDeptTree, fetchUpdateDept } from '@/service/api';
import type { Option } from '@/components/advanced/config-form/config-form-type';
import { useConfigForm } from '@/hooks/common/config-form';

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
    add: $t('page.manage.dept.add'),
    edit: $t('page.manage.dept.edit')
  };
  return titles[props.operateType];
});

type Model = Partial<Api.SystemManage.Dept>;

const model = ref(createDefaultModel());

const formFields = useConfigForm<Model>(() => ({
  name: {
    key: 'name',
    label: $t('page.manage.dept.name'),
    type: 'Input',
    required: true,
    props: {
      maxlength: 20,
      'show-count': true,
      placeholder: $t('common.pleaseEnter') + $t('page.manage.dept.name')
    }
  },
  order: {
    key: 'order',
    label: $t('page.manage.common.order'),
    type: 'InputNumber',
    props: {
      min: 1,
      max: 9999,
      placeholder: $t('common.pleaseEnter') + $t('page.manage.common.order')
    }
  },
  parentId: {
    key: 'parentId',
    label: $t('page.manage.dept.parent'),
    type: 'TreeSelect',
    span: 24,
    // tree select 比较特殊 options 可以通过 props 传入
    props: {
      placeholder: $t('common.pleaseSelect') + $t('page.manage.dept.parent'),
      options: []
    },
    required: false
  },
  default: {
    key: 'default',
    label: $t('page.manage.dept.default'),
    type: 'Switch',
    props: {
      'checked-value': 1,
      'unchecked-value': 0
    }
  }
}));

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
    formFields.value!.parentId!.props!.options = mapTree(data);
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
  <NDrawer v-model:show="visible" class="lt-sm:!w-100%" width="50%" display-directive="show">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <ConfigForm ref="formRef" v-model:model="model" :fields="formFields" />
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
