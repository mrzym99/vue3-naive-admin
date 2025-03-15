<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import type { CascaderOption } from 'naive-ui';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchCreateMenu, fetchGetAllPermissions, fetchGetMenuTree, fetchUpdateMenu } from '@/service/api';
import type { Option } from '@/components/advanced/config-form';
import { str2tree } from '@/utils/common';
import routeList from '@/router/elegant/generate-route-list';
import { useConfigForm } from '@/hooks/common/config-form';
import { MenuIconTypeEnum, MenuTypeEnum, StatusEnum } from '@/constants/enum';

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
    add: $t('page.manage.menu.add'),
    edit: $t('page.manage.menu.edit')
  };
  return titles[props.operateType];
});

type Model = Partial<Api.SystemManage.Menu>;

const model = ref(createDefaultModel());
const iframePage = 'layout.base$view.iframe-page';

const menuConfigForm = useConfigForm<Model>(() => ({
  type: {
    key: 'type',
    label: $t('page.manage.menu.menuType'),
    type: 'Radio',
    disabled: props.operateType === 'edit',
    options: [
      {
        value: MenuTypeEnum.DIRECTORY,
        label: $t('page.manage.menu.type.directory')
      },
      {
        value: MenuTypeEnum.MENU,
        label: $t('page.manage.menu.type.menu')
      },
      {
        value: MenuTypeEnum.PERMISSION,
        label: $t('page.manage.menu.type.permission')
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
    label: $t('page.manage.menu.parent'),
    type: 'TreeSelect',
    props: {
      treeData: [],
      treeNodeFilterProp: 'title',
      placeholder: $t('common.pleaseSelect') + $t('page.manage.menu.parent'),
      filterable: true
    }
  },
  title: {
    key: 'title',
    label: $t('page.manage.menu.menuName'),
    type: 'Input',
    required: true,
    props: {
      placeholder: $t('common.pleaseInput') + $t('page.manage.menu.menuName')
    }
  },
  i18nKey: {
    key: 'i18nKey',
    label: $t('page.manage.menu.i18nKey'),
    type: 'Input',
    props: {
      placeholder: $t('common.pleaseInput') + $t('page.manage.menu.i18nKey')
    }
  },
  iconType: {
    key: 'iconType',
    label: $t('page.manage.menu.iconTypeTitle'),
    type: 'Select',
    required: true,
    hide: (): boolean => {
      return isPermission();
    },
    props: {
      placeholder: $t('common.pleaseSelect') + $t('page.manage.menu.iconTypeTitle'),
      options: [
        {
          label: 'iconify',
          value: MenuIconTypeEnum.ICONIFY
        },
        {
          label: 'local',
          value: MenuIconTypeEnum.LOCAL
        }
      ],
      'onUpdate:value': (value: number) => {
        menuConfigForm.value.type!.props!.type = value;
      }
    }
  },
  icon: {
    key: 'icon',
    label: $t('page.manage.menu.icon'),
    type: 'IconSelect',
    hide: (): boolean => {
      return isPermission();
    },
    props: {
      type: 0,
      placeholder: $t('common.pleaseSelect') + $t('page.manage.menu.icon')
    }
  },
  path: {
    key: 'path',
    label: $t('page.manage.menu.routePath'),
    type: 'Select',
    hide: (): boolean => {
      return isPermission();
    },
    props: {
      filterable: true,
      tag: true,
      placeholder: `${$t('common.pleaseInput')}/${$t('common.pleaseSelect')}${$t('page.manage.menu.routePath')}`,
      options: [],
      'onUpdate:value': onPathSelectChange
    }
  },
  name: {
    key: 'name',
    label: $t('page.manage.menu.routeName'),
    type: 'Input',
    hide: (): boolean => {
      return isPermission();
    },
    props: {
      placeholder: $t('common.pleaseInput') + $t('page.manage.menu.routeName')
    }
  },
  component: {
    key: 'component',
    label: $t('page.manage.menu.component'),
    type: 'Input',
    hide: (): boolean => {
      return isPermission() || hideComponent();
    },
    props: {
      placeholder: $t('common.pleaseInput') + $t('page.manage.menu.component')
    }
  },
  permission: {
    key: 'permission',
    label: $t('page.manage.menu.permission'),
    type: 'Cascader',
    hide: () => {
      return !isPermission();
    },
    props: {
      filterable: true,
      placeholder: $t('common.pleaseSelect') + $t('page.manage.menu.permission'),
      'check-strategy': 'child',
      separator: ':',
      options: []
    }
  },
  keepAlive: {
    key: 'keepAlive',
    label: $t('page.manage.menu.keepAlive'),
    type: 'Switch',
    hide: (): boolean => {
      return isPermission();
    }
  },
  hideInMenu: {
    key: 'hideInMenu',
    label: $t('page.manage.menu.hideInMenu'),
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
    label: $t('page.manage.menu.activeMenu'),
    type: 'TreeSelect',
    hide: (): boolean => {
      return !model.value.hideInMenu || isPermission();
    },
    props: {
      placeholder: $t('common.pleaseSelect') + $t('page.manage.menu.activeMenu'),
      treeData: []
    }
  },
  isExt: {
    key: 'isExt',
    label: $t('page.manage.menu.isExt'),
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
    label: $t('page.manage.menu.extOpenMode'),
    type: 'Radio',
    hide: (): boolean => {
      return !model.value.isExt;
    },
    options: [
      {
        label: $t('page.manage.menu.inner'),
        value: 0
      },
      {
        label: $t('page.manage.menu.black'),
        value: 1
      }
    ]
  },
  href: {
    key: 'href',
    label: $t('page.manage.menu.href'),
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
    label: $t('page.manage.menu.multiTab'),
    type: 'Switch',
    hide: (): boolean => {
      return isPermission() || model.value.extOpenMode === 1;
    }
  },
  fixedIndexInTab: {
    key: 'fixedIndexInTab',
    label: $t('page.manage.menu.fixedIndexInTab'),
    type: 'InputNumber',
    hide: (): boolean => {
      return isPermission() || model.value.extOpenMode === 1;
    },
    props: {
      min: 1,
      max: 9999,
      placeholder: $t('common.pleaseInput') + $t('page.manage.menu.fixedIndexInTab')
    }
  },
  order: {
    key: 'order',
    label: $t('page.manage.menu.order'),
    type: 'InputNumber',
    props: {
      min: 1,
      max: 9999,
      placeholder: $t('common.pleaseInput') + $t('page.manage.menu.order')
    }
  },
  status: {
    key: 'status',
    label: $t('common.status'),
    type: 'Radio',
    props: {
      placeholder: '请选择状态'
    },
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
  }
}));

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
    menuConfigForm.value.parentId!.props!.options = mapTree(data);
    menuConfigForm.value.activeMenu!.props!.options = mapTree(data);
  }
}

async function getAllPermissions() {
  const { data, error } = await fetchGetAllPermissions();
  if (!error) {
    menuConfigForm.value.permission!.props!.options = data.reduce((prev: CascaderOption[], curr: string) => {
      str2tree(curr, prev, ':');
      return prev;
    }, []);
  }
}

function getAllRoutes() {
  const routes = routeList;
  menuConfigForm.value.path!.props!.options = routes.map(item => ({
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
