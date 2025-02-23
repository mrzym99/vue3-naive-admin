<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchCreateMenu, fetchGetMenuTree, fetchUpdateMenu } from '@/service/api';
import type { ConfigFormType, Option } from '@/components/advanced/config-form';

defineOptions({
  name: 'MenuOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** addData */
  addData?: Api.SystemManage.Menu | null;
  /** the edit row data */
  editData?: Api.SystemManage.Menu | null;
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
    add: $t('page.manage.menu.addMenu'),
    edit: $t('page.manage.menu.editMenu')
  };
  return titles[props.operateType];
});

type Model = Partial<Api.SystemManage.Menu>;

const model = ref(createDefaultModel());

const menuConfigForm = reactive<ConfigFormType>([
  {
    key: 'type',
    label: '菜单类型',
    type: 'Radio',
    options: [
      {
        value: 0,
        label: '目录'
      },
      {
        value: 1,
        label: '菜单'
      },
      {
        value: 2,
        label: '权限'
      }
    ],
    props: {
      'onUpdate:value': (value: number) => {
        if (value === 0) {
          model.value.parentId = '';
        }
        if (value !== 2) {
          model.value.permission = '';
        }
      }
    }
  },
  {
    key: 'title',
    label: '菜单名称',
    type: 'Input',
    required: true,
    props: {
      placeholder: '请输入菜单名称'
    }
  },
  {
    key: 'i18nKey',
    label: '国际化',
    type: 'Input',
    props: {
      placeholder: '请输入国际化key'
    }
  },
  {
    key: 'parentId',
    label: '上级菜单',
    type: 'TreeSelect',
    hide: (): boolean => {
      return Boolean(!model.value.type);
    },
    props: {
      treeData: [],
      treeNodeFilterProp: 'title',
      placeholder: '请选择上级菜单'
    }
  },
  {
    key: 'iconType',
    label: '图标类型',
    type: 'Select',
    required: true,
    hide: (): boolean => {
      return isPermission();
    },
    props: {
      placeholder: '请选择图标类型',
      options: [
        {
          label: 'iconify',
          value: 0
        },
        {
          label: 'local',
          value: 1
        }
      ]
    }
  },
  {
    key: 'icon',
    label: '图标',
    type: 'Input',
    hide: (): boolean => {
      return isPermission();
    },
    props: {
      placeholder: '请输入图标'
    }
  },
  {
    key: 'path',
    label: '菜单地址',
    type: 'Input',
    hide: (): boolean => {
      return isPermission();
    },
    props: {
      placeholder: '请输入路由地址'
    }
  },
  {
    key: 'name',
    label: '组件名称',
    type: 'Input',
    hide: (): boolean => {
      return isPermission();
    },
    props: {
      placeholder: '请输入组件名称'
    }
  },
  {
    key: 'component',
    label: '组件路径',
    type: 'Input',
    hide: (): boolean => {
      return isPermission();
    },
    props: {
      placeholder: '请输入组件路径'
    }
  },
  {
    key: 'permission',
    label: '权限标识',
    type: 'Input',
    hide: () => {
      return !isPermission();
    },
    props: {
      placeholder: '请输入权限标识'
    }
  },
  {
    key: 'keepAlive',
    label: '缓存',
    type: 'Switch'
  },
  {
    key: 'hideInMenu',
    label: '是否隐藏',
    type: 'Switch',
    props: {
      'onUpdate:value': (val: boolean) => {
        if (val) {
          model.value.isExt = false;
        }
      }
    }
  },
  {
    key: 'activeMenu',
    label: '激活菜单',
    type: 'TreeSelect',
    hide: (): boolean => {
      return !model.value.hideInMenu;
    },
    props: {
      placeholder: '请选择激活菜单',
      treeData: []
    }
  },
  {
    key: 'isExt',
    label: '是否外链',
    type: 'Switch',
    hide: (): boolean => {
      return Boolean(model.value.hideInMenu);
    }
  },
  {
    key: 'extOpenMode',
    label: '外链方式',
    type: 'Radio',
    hide: (): boolean => {
      return !model.value.isExt;
    },
    options: [
      {
        label: '内嵌页打开',
        value: 0
      },
      {
        label: '新窗口打开',
        value: 1
      }
    ]
  },
  {
    key: 'multiTab',
    label: '多页签',
    type: 'Switch'
  },
  {
    key: 'fixedIndexInTab',
    label: '固定页签的序号',
    type: 'InputNumber'
  },
  {
    key: 'order',
    label: '排序',
    type: 'InputNumber',
    props: {
      placeholder: '请输入排序'
    }
  },
  {
    key: 'status',
    label: '状态',
    type: 'Radio',
    required: true,
    props: {
      placeholder: '请选择状态'
    },
    options: [
      {
        label: '正常',
        value: 1
      },
      {
        label: '禁用',
        value: 0
      }
    ]
  }
]);

function isPermission() {
  return model.value.type === 2;
}

function createDefaultModel(): Model {
  return {
    parentId: '',
    type: 0,
    title: '',
    name: '',
    i18nKey: null,
    icon: '',
    iconType: 0,
    path: '',
    component: '',
    permission: '',
    order: 1,
    isExt: false,
    extOpenMode: 0,
    hideInMenu: false,
    activeMenu: null,
    multiTab: false,
    fixedIndexInTab: null,
    status: 1
  };
}

function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.editData) {
    Object.assign(model.value, props.editData);
  } else if (props.operateType === 'add' && props.addData) {
    Object.assign(model.value, props.addData);
  }
}

async function addOrEditMenu() {
  const api = props.operateType === 'add' ? fetchCreateMenu : fetchUpdateMenu;

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
  await addOrEditMenu();
  // request
  closeDrawer();
  emit('submitted');
}

function mapTree(tree: Api.SystemManage.MenuTree): Option[] {
  return tree.map(item => {
    const { children } = item;
    return {
      label: item.title,
      value: item.id,
      key: item.id,
      disabled: props.operateType === 'edit' && item.id === model.value.parentId,
      isLeaf: !children || children.length === 0,
      children: children ? mapTree(children) : []
    };
  });
}

async function getMenuTree() {
  const { data, error } = await fetchGetMenuTree();
  if (!error) {
    menuConfigForm[3]!.props!.options = mapTree(data);
    menuConfigForm[12]!.props!.options = mapTree(data);
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
      <ConfigForm ref="formRef" v-model:model="model" :fields="menuConfigForm" />
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
