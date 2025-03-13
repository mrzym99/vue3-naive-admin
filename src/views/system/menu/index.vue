<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { Icon } from '@iconify/vue';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchDeleteMenu, fetchGetMenuList } from '@/service/api';
import { $t } from '@/locales';
import type { SearchFormType } from '@/components/advanced/search-form';
import { enableStatusOptions, enableStatusRecord, menuIconTypeRecord, menuTypeRecord } from '@/constants/business';
import { useAuth } from '@/hooks/business/auth';
import type { DetailsDescriptionsType } from '@/components/advanced/details-descriptions';
import SvgIcon from '@/components/custom/svg-icon.vue';
import { flatTreeData } from '@/utils/common';
import MenuOperateDrawer from './modules/menu-operate-drawer.vue';

const appStore = useAppStore();
const { hasAuth } = useAuth();

const menuSearchForm: SearchFormType<Api.SystemManage.MenuSearchParams> = [
  {
    key: 'title',
    label: '菜单名称',
    type: 'Input',
    props: {
      placeholder: '请输入菜单名称'
    }
  },
  {
    key: 'path',
    label: '菜单路径',
    type: 'Input',
    props: {
      placeholder: '请输入菜单路径'
    }
  },
  {
    key: 'status',
    label: '状态',
    type: 'Select',
    props: {
      placeholder: '请选择状态',
      options: enableStatusOptions
    }
  }
];

const {
  columns,
  columnChecks,
  data,
  loading,
  getDataByPage,
  getData,
  searchParams,
  resetSearchParams,
  setExpand,
  setFold,
  expandedRowKeys,
  isTreeTable
} = useTable({
  apiFn: fetchGetMenuList,
  showTotal: true,
  isTreeTable: true,
  apiParams: {
    currentPage: 1,
    pageSize: 999,
    title: '',
    name: '',
    path: '',
    status: null
  },
  columns: () => [
    {
      key: 'title',
      title: '名称', // $t('page.manage.Menu.role'),
      align: 'left',
      minWidth: 180,
      tree: true,
      fixed: 'left',
      render: row => {
        return (
          <span class={'detail-link'} onClick={() => detail(row)}>
            {row.i18nKey ? $t(row.i18nKey) : row.title}
          </span>
        );
      }
    },
    {
      key: 'icon',
      title: '图标',
      align: 'center',
      width: 50,
      render: row => {
        if (!row.icon) {
          return null;
        }
        return (
          <div class={'flex justify-center'}>
            <Icon class={'text-icon'} icon={row.icon} />
          </div>
        );
      }
    },
    {
      key: 'type',
      title: '类型', // $t('page.manage.Menu.role'),
      align: 'center',
      width: 60,
      render: row => {
        const label = $t(menuTypeRecord[row.type]);

        const tagMap: Record<Api.SystemManage.MenuType, NaiveUI.ThemeColor> = {
          0: 'warning',
          1: 'success',
          2: 'error'
        };

        return <NTag type={tagMap[row.type]}>{label}</NTag>;
      }
    },
    {
      key: 'path',
      title: '菜单路径',
      align: 'center',
      width: 150,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'name',
      title: '组件名称',
      align: 'center',
      width: 150,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'component',
      title: '组件路径',
      align: 'center',
      width: 180,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'permission',
      title: '权限标识',
      align: 'center',
      width: 180,
      render: row => {
        if (!row.permission) {
          return null;
        }
        return <NTag type={'primary'}>{row.permission}</NTag>;
      }
    },
    {
      key: 'order',
      title: '排序',
      align: 'center',
      width: 100
    },
    {
      key: 'keepAlive',
      title: '是否缓存',
      align: 'center',
      width: 80,
      render: row => {
        const type = row.keepAlive ? 'success' : 'warning';
        const label = row.keepAlive ? $t('common.yesOrNo.yes') : $t('common.yesOrNo.no');
        return <NTag type={type}>{label}</NTag>;
      }
    },
    {
      key: 'status',
      title: $t('common.status'),
      align: 'center',
      width: 100,
      render: row => {
        if (row.status === null) {
          return null;
        }

        const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
          1: 'success',
          0: 'error'
        };

        const label = $t(enableStatusRecord[row.status]);

        return <NTag type={tagMap[row.status]}>{label}</NTag>;
      }
    },
    {
      fixed: 'right',
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 220,
      render: row => (
        <div class="flex justify-items-start gap-8px">
          {row.type === 0 && (
            <NButton
              disabled={!hasAuth('system:menu:create')}
              type="success"
              ghost
              size="small"
              onClick={() => add(row.id, 1)}
            >
              {$t('page.manage.menu.addChildMenu')}
            </NButton>
          )}
          {row.type === 1 && (
            <NButton
              disabled={!hasAuth('system:menu:create')}
              type="error"
              ghost
              size="small"
              onClick={() => add(row.id, 2)}
            >
              {$t('page.manage.menu.addPermission')}
            </NButton>
          )}
          <NButton
            disabled={!hasAuth('system:menu:update')}
            type="primary"
            ghost
            size="small"
            onClick={() => edit(row.id)}
          >
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton disabled={!hasAuth('system:menu:delete')} type="error" ghost size="small">
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>
      )
    }
  ]
});

const detailColumns: DetailsDescriptionsType<Api.SystemManage.Menu> = [
  {
    key: 'type',
    label: '菜单类型',
    render: row => {
      const label = $t(menuTypeRecord[row.type]);
      const tagMap: Record<Api.SystemManage.MenuType, NaiveUI.ThemeColor> = {
        0: 'warning',
        1: 'success',
        2: 'error'
      };
      return <NTag type={tagMap[row.type]}>{label}</NTag>;
    }
  },
  {
    key: 'parentId',
    label: '上级菜单',
    render: row => {
      if (!row.parentI18Key) return null;
      return $t(row.parentI18Key);
    }
  },
  {
    key: 'title',
    label: '菜单名称'
  },
  {
    key: 'i18nKey',
    label: '国际化key'
  },
  {
    key: 'iconType',
    label: '图标类型',
    hide: (): boolean => {
      return isPermission();
    },
    render: row => {
      const label = $t(menuIconTypeRecord[row.iconType]);
      const tagMap: Record<Api.SystemManage.IconType, NaiveUI.ThemeColor> = {
        0: 'primary',
        1: 'success'
      };
      return <NTag type={tagMap[row.iconType]}>{label}</NTag>;
    }
  },
  {
    key: 'icon',
    label: '图标',
    hide: (): boolean => {
      return isPermission();
    },
    render: row => {
      if (!row.icon) {
        return null;
      }
      return <SvgIcon icon={row.icon} class="p-5px text-30px" />;
    }
  },
  {
    key: 'path',
    label: '菜单地址',
    hide: (): boolean => {
      return isPermission();
    }
  },
  {
    key: 'name',
    label: '路由名称',
    hide: (): boolean => {
      return isPermission();
    }
  },
  {
    key: 'component',
    label: '组件地址',
    hide: (): boolean => {
      return isPermission() || hideComponent();
    }
  },
  {
    key: 'permission',
    label: '权限标识',
    hide: () => {
      return !isPermission();
    }
  },
  {
    key: 'keepAlive',
    label: '是否缓存',
    hide: (): boolean => {
      return isPermission();
    },
    render: row => {
      return row.keepAlive ? $t('common.yesOrNo.yes') : $t('common.yesOrNo.no');
    }
  },
  {
    key: 'hideInMenu',
    label: '是否隐藏',
    hide: (): boolean => {
      return isPermission();
    },
    render: row => {
      return row.hideInMenu ? $t('common.yesOrNo.yes') : $t('common.yesOrNo.no');
    }
  },
  {
    key: 'activeMenu',
    label: '激活菜单',
    hide: (row): boolean => {
      return !row.hideInMenu;
    }
  },
  {
    key: 'isExt',
    label: '是否外链',
    hide: (row): boolean => {
      return Boolean(row.hideInMenu) || isPermission();
    },
    render: row => {
      return row.isExt ? $t('common.yesOrNo.yes') : $t('common.yesOrNo.no');
    }
  },
  {
    key: 'extOpenMode',
    label: '外链方式',
    hide: (row): boolean => {
      return !row.isExt;
    },
    render: row => {
      return row.extOpenMode === 0 ? '内嵌页打开' : '新窗口打开';
    }
  },
  {
    key: 'href',
    label: '外链地址',
    hide: (row): boolean => {
      return !row.isExt;
    }
  },
  {
    key: 'multiTab',
    label: '多页签',
    hide: (row): boolean => {
      return isPermission() || row.extOpenMode === 1;
    },
    render: row => {
      return row.multiTab ? $t('common.yesOrNo.yes') : $t('common.yesOrNo.no');
    }
  },
  {
    key: 'fixedIndexInTab',
    label: '固定页签的序号',
    hide: (row): boolean => {
      return isPermission() || row.extOpenMode === 1;
    }
  },
  {
    key: 'order',
    label: '排序'
  },
  {
    key: 'status',
    label: $t('common.status'),
    render: row => {
      if (row.status === null) return null;
      const label = $t(enableStatusRecord[row.status]);
      const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
        1: 'success',
        0: 'error'
      };
      return <NTag type={tagMap[row.status]}>{label}</NTag>;
    }
  }
];

const {
  drawerVisible,
  operateType,
  addingData,
  editingData,
  handleAdd,
  handleEdit,
  onDeleted,
  modelVisible,
  detailData,
  handleDetail
} = useTableOperate(data, getData);

function isPermission() {
  return detailData.value?.type === 2;
}

function hideComponent() {
  return detailData.value?.extOpenMode === 1;
}
async function detail({ id, parentId }: Api.SystemManage.Menu) {
  if (hasAuth('system:user:read')) {
    const parentMenu = flatTreeData(data.value).find(item => item.id === parentId);
    handleDetail(id, {
      parentTitle: parentMenu?.title,
      parentI18Key: parentMenu?.i18nKey
    } as any);
  } else {
    window.$message?.error($t('common.noPermission'));
  }
}

function add(id: string, type: Api.SystemManage.MenuType) {
  handleAdd({
    parentId: id,
    type
  });
}

function edit(id: string) {
  handleEdit(id);
}

async function handleDelete(id: string) {
  const { error } = await fetchDeleteMenu(id);
  if (!error) {
    onDeleted();
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <div class="h-full flex-col-stretch">
        <SearchForm
          v-model:model="searchParams"
          :fields="menuSearchForm"
          @search="getDataByPage"
          @reset="resetSearchParams"
        />
        <TableHeaderOperation
          v-model:columns="columnChecks"
          prefix="system:Menu"
          :hide-delete="true"
          :loading="loading"
          :tree-table="isTreeTable"
          @add="handleAdd"
          @refresh="getData"
          @expand="setExpand"
          @fold="setFold"
        />
        <NDataTable
          v-model:expanded-row-keys="expandedRowKeys"
          :columns="columns"
          :data="data"
          size="small"
          :flex-height="!appStore.isMobile"
          :loading="loading"
          remote
          :row-key="row => row.id"
          class="sm:h-full"
        />
      </div>
    </NCard>
    <MenuOperateDrawer
      v-model:visible="drawerVisible"
      :operate-type="operateType"
      :add-data="addingData"
      :edit-data="editingData"
      @submitted="getDataByPage"
    />
    <DetailsDescriptions
      v-model:visible="modelVisible"
      title="菜单详情"
      class="!w-[60%]"
      :fields="detailColumns"
      :data="detailData"
    />
  </div>
</template>

<style scoped></style>
