<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import type { TreeOption } from 'naive-ui';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchCreateRole, fetchGetMenuTree, fetchUpdateRole } from '@/service/api';
import type { Option } from '@/components/advanced/config-form';
import { flatTreeData } from '@/utils/common';
import { useConfigForm } from '@/hooks/common/config-form';

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
    add: $t('page.manage.role.add'),
    edit: $t('page.manage.role.edit')
  };
  return titles[props.operateType];
});

type Model = Partial<Api.SystemManage.Role>;

const model = ref(createDefaultModel());

const roleConfigForm = useConfigForm<Model>(() => ({
  name: {
    key: 'name',
    label: $t('page.manage.role.name'),
    type: 'Input',
    required: true,
    props: {
      maxlength: 20,
      'show-count': true,
      placeholder: $t('common.pleaseInput') + $t('page.manage.role.name')
    }
  },
  value: {
    key: 'value',
    label: $t('page.manage.role.value'),
    type: 'Input',
    required: true,
    props: {
      maxlength: 20,
      'show-count': true,
      placeholder: $t('common.pleaseInput') + $t('page.manage.role.value')
    },
    rules: [
      {
        required: true,
        message: $t('common.pleaseInput') + $t('page.manage.role.value'),
        validator: (_: any, value: any) => {
          return Boolean(value);
        },
        trigger: 'blur'
      },
      {
        required: true,
        message: $t('page.manage.role.valueErrorMessage'),
        validator: (_: any, value: string) => {
          return /^[a-zA-Z0-9_-]+$/.test(value);
        },
        trigger: 'blur'
      }
    ]
  },
  status: {
    key: 'status',
    label: $t('page.manage.role.status'),
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
  default: {
    key: 'default',
    label: $t('page.manage.role.default'),
    type: 'Switch',
    props: {
      'checked-value': 1,
      'unchecked-value': 0
    }
  },
  description: {
    key: 'description',
    label: $t('page.manage.role.desc'),
    type: 'Input',
    span: 24,
    props: {
      type: 'textarea',
      placeholder: $t('common.pleaseInput') + $t('page.manage.role.desc')
    }
  },
  menuIds: {
    key: 'menuIds',
    label: $t('page.manage.role.menus'),
    type: 'TreeSelect',
    span: 24,
    slot: 'menu',
    props: {
      options: []
    }
  }
}));

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
      label: item.i18nKey ? $t(item.i18nKey) : item.title,
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
    roleConfigForm.value.menuIds!.props!.options = mapTree(data);
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

function updateCheckdKeys(
  keys: Array<string>,
  _options: Array<TreeOption | null>,
  meta: {
    node: TreeOption | null;
    action: 'check' | 'uncheck';
  }
) {
  const { node, action } = meta;
  if (action === 'check') {
    if (node?.children && node.children.length) {
      const allChildren = flatTreeData<TreeOption>(node.children);
      // 去重再返回
      model.value.menuIds = Array.from(new Set([...keys, ...allChildren.map(v => v.key as string)]));
    }
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
  <NDrawer v-model:show="visible" display-directive="show" width="60%">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <ConfigForm ref="formRef" v-model:model="model" :fields="roleConfigForm">
        <template #menu="{ formModel, key, field }">
          <NCard>
            <NTree
              v-model:checked-keys="formModel[key]"
              :data="field.props.options"
              block-line
              expand-on-click
              checkable
              @update:checked-keys="updateCheckdKeys"
            />
          </NCard>
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
