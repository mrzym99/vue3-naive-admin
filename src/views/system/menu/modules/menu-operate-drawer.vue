<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import type { CascaderOption } from 'naive-ui';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchCreateMenu, fetchGetAllPermissions, fetchGetMenuTree, fetchUpdateMenu } from '@/service/api';
import type { ConfigFormObjectType, Option } from '@/components/advanced/config-form';
import { str2tree } from '@/utils/common';
import routeList from '@/router/elegant/generate-route-list';

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
const iframePage = 'layout.base$view.iframe-page';

const menuConfigForm = reactive<ConfigFormObjectType>({
  type: {
    key: 'type',
    label: '菜单类型',
    type: 'Radio',
    disabled: props.operateType === 'edit',
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
        if (value !== 2) {
          model.value.permission = null;
        } else {
          model.value.component = null;
          model.value.path = null;
          model.value.icon = null;
          model.value.isExt = false;
          model.value.name = '';
        }
      }
    }
  },
  parentId: {
    key: 'parentId',
    label: '上级菜单',
    type: 'TreeSelect',
    props: {
      treeData: [],
      treeNodeFilterProp: 'title',
      placeholder: '请选择上级菜单',
      filterable: true
    }
  },
  title: {
    key: 'title',
    label: '菜单名称',
    type: 'Input',
    required: true,
    props: {
      placeholder: '请输入菜单名称'
    }
  },
  i18nKey: {
    key: 'i18nKey',
    label: '国际化',
    type: 'Input',
    props: {
      placeholder: '请输入国际化key'
    }
  },
  iconType: {
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
      ],
      'onUpdate:value': (value: number) => {
        menuConfigForm.type!.props!.type = value;
      }
    }
  },
  icon: {
    key: 'icon',
    label: '图标',
    type: 'IconSelect',
    hide: (): boolean => {
      return isPermission();
    },
    props: {
      type: 0,
      placeholder: '请选择图标'
    }
  },
  path: {
    key: 'path',
    label: '菜单地址',
    type: 'Select',
    hide: (): boolean => {
      return isPermission();
    },
    props: {
      filterable: true,
      tag: true,
      placeholder: '请输入/选择菜单地址',
      options: [],
      'onUpdate:value': onPathSelectChange
    }
  },
  name: {
    key: 'name',
    label: '路由名称',
    type: 'Input',
    hide: (): boolean => {
      return isPermission();
    },
    props: {
      placeholder: '请输入路由名称'
    }
  },
  component: {
    key: 'component',
    label: '组件路径',
    type: 'Input',
    hide: (): boolean => {
      return isPermission() || hideComponent();
    },
    props: {
      placeholder: '请输入组件路径'
    }
  },
  permission: {
    key: 'permission',
    label: '权限标识',
    type: 'Cascader',
    hide: () => {
      return !isPermission();
    },
    props: {
      filterable: true,
      placeholder: '请选择权限标识',
      'check-strategy': 'child',
      separator: ':',
      options: []
    }
  },
  keepAlive: {
    key: 'keepAlive',
    label: '缓存',
    type: 'Switch',
    hide: (): boolean => {
      return isPermission();
    }
  },
  hideInMenu: {
    key: 'hideInMenu',
    label: '是否隐藏',
    type: 'Switch',
    hide: (): boolean => {
      return isPermission();
    },
    props: {
      'onUpdate:value': (val: boolean) => {
        if (val) {
          model.value.isExt = false;
        }
      }
    }
  },
  activeMenu: {
    key: 'activeMenu',
    label: '激活菜单',
    type: 'TreeSelect',
    hide: (): boolean => {
      return !model.value.hideInMenu || isPermission();
    },
    props: {
      placeholder: '请选择激活菜单',
      treeData: []
    }
  },
  isExt: {
    key: 'isExt',
    label: '是否外链',
    type: 'Switch',
    hide: (): boolean => {
      return Boolean(model.value.hideInMenu) || isPermission();
    },
    props: {
      'onUpdate:value': (val: boolean) => {
        if (val) {
          model.value.component = iframePage;
        } else {
          model.value.component = '';
          model.value.extOpenMode = 0;
        }
      }
    }
  },
  extOpenMode: {
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
  href: {
    key: 'href',
    label: '外链地址',
    type: 'Input',
    hide: (): boolean => {
      return !model.value.isExt;
    },
    required: (): boolean => {
      return Boolean(model.value.isExt);
    }
  },
  multiTab: {
    key: 'multiTab',
    label: '多页签',
    type: 'Switch',
    hide: (): boolean => {
      return isPermission() || model.value.extOpenMode === 1;
    }
  },
  fixedIndexInTab: {
    key: 'fixedIndexInTab',
    label: '固定页签的序号',
    type: 'InputNumber',
    hide: (): boolean => {
      return isPermission() || model.value.extOpenMode === 1;
    },
    props: {
      min: 1,
      max: 9999,
      placeholder: '请输入固定页签的序号'
    }
  },
  order: {
    key: 'order',
    label: '排序',
    type: 'InputNumber',
    props: {
      min: 1,
      max: 9999,
      placeholder: '请输入排序'
    }
  },
  status: {
    key: 'status',
    label: '状态',
    type: 'Radio',
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
});

function isPermission() {
  return model.value.type === 2;
}

function hideComponent() {
  return model.value.extOpenMode === 1;
}

function onPathSelectChange(path: string) {
  const route = routeList.find(item => item.path === path);
  if (route) {
    model.value.component = route.component;
    model.value.name = route.name;
    model.value.title = route.meta?.title;
    model.value.i18nKey = route.meta?.i18nKey;
  }
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
    path: null,
    component: null,
    permission: null,
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

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  const api = props.operateType === 'add' ? fetchCreateMenu : fetchUpdateMenu;
  const { error } = await api(model.value as any);
  if (!error) {
    const message = props.operateType === 'add' ? $t('common.addSuccess') : $t('common.updateSuccess');
    window.$message?.success(message);
    closeDrawer();
    emit('submitted');
  }
}

function mapTree(tree: Api.SystemManage.MenuTree): Option[] {
  return tree
    .map(item => {
      const { children } = item;
      return {
        label: item.title,
        value: item.id,
        key: item.id,
        type: item.type,
        disabled: props.operateType === 'edit' && (item.id === model.value.parentId || item.id === model.value.id),
        isLeaf: !children || children.length === 0 || children.every(child => child.type === 2),
        children: children ? mapTree(children) : []
      };
    })
    .filter(item => item.type !== 2);
}

async function getMenuTree() {
  const { data, error } = await fetchGetMenuTree();
  if (!error) {
    menuConfigForm.parentId!.props!.options = mapTree(data);
    menuConfigForm.activeMenu!.props!.options = mapTree(data);
  }
}

async function getAllPermissions() {
  const { data, error } = await fetchGetAllPermissions();
  if (!error) {
    menuConfigForm.permission!.props!.options = data.reduce((prev: CascaderOption[], curr: string) => {
      str2tree(curr, prev, ':');
      return prev;
    }, []);
  }
}

function getAllRoutes() {
  const routes = routeList;
  menuConfigForm.path!.props!.options = routes.map(item => ({
    label: item.path,
    value: item.path
  }));
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    getMenuTree();
    getAllPermissions();
    getAllRoutes();
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
