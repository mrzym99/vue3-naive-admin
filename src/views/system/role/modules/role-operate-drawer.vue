<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchCreateRole, fetchGetMenuTree, fetchUpdateRole } from '@/service/api';
import type { ConfigFormArrayType, Option } from '@/components/advanced/config-form';

defineOptions({
  name: 'RoleOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.Role | null;
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
    add: $t('page.manage.role.addRole'),
    edit: $t('page.manage.role.editRole')
  };
  return titles[props.operateType];
});

type Model = Partial<Api.SystemManage.Role>;

const model = ref(createDefaultModel());

const roleConfigForm: ConfigFormArrayType = reactive([
  {
    key: 'name',
    label: '角色名称',
    type: 'Input',
    props: {
      placeholder: '请输入角色名称'
    }
  },
  {
    key: 'value',
    label: '角色值',
    type: 'Input',
    props: {
      placeholder: '请输入角色值'
    }
  },
  {
    key: 'status',
    label: '状态',
    type: 'Radio',
    options: [
      {
        label: $t('common.enable'),
        value: 1
      },
      {
        label: $t('common.disable'),
        value: 0
      }
    ]
  },
  {
    key: 'default',
    label: '默认角色',
    type: 'Switch'
  },
  {
    key: 'description',
    label: '描述',
    type: 'Input',
    span: 24,
    props: {
      type: 'textarea',
      placeholder: '请输入描述'
    }
  },
  {
    key: 'menuIds',
    label: '菜单权限',
    type: 'TreeSelect',
    span: 24,
    props: {
      multiple: true,
      placeholder: '请选择菜单权限',
      treeCheckable: true,
      treeCheckStrictly: true,
      treeData: []
    }
  }
]);

function createDefaultModel(): Model {
  return {
    name: '',
    status: 1,
    value: '',
    description: '',
    default: 0,
    menuIds: []
  };
}

function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, props.rowData);
  }
}

function mapTree(tree: Api.SystemManage.MenuTree): Option[] {
  return tree.map(item => {
    const { children } = item;
    return {
      label: item.title,
      value: item.id,
      key: item.id,
      isLeaf: !children || children.length === 0,
      children: children ? mapTree(children) : []
    };
  });
}

async function getMenuTree() {
  const { data, error } = await fetchGetMenuTree();
  if (!error) {
    roleConfigForm[roleConfigForm.length - 1]!.props!.options = mapTree(data);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  const api = props.operateType === 'add' ? fetchCreateRole : fetchUpdateRole;

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
    getMenuTree();
    nextTick(() => {
      restoreValidation();
    });
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" width="40%">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <ConfigForm ref="formRef" v-model:model="model" :fields="roleConfigForm" />
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
