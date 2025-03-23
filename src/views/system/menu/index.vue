<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { Icon } from '@iconify/vue';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchDeleteMenu, fetchGetMenuList } from '@/service/api';
import { $t, getLocale } from '@/locales';
import { enableStatusRecord, menuIconTypeRecord, menuTypeRecord } from '@/constants/business';
import { useAuth } from '@/hooks/business/auth';
import SvgIcon from '@/components/custom/svg-icon.vue';
import { flatTreeData } from '@/utils/common';
import { useSearchForm } from '@/hooks/common/search-form';
import { useDetailDescriptions } from '@/hooks/common/detail-descriptions';
import { StatusEnum } from '@/constants/enum';
import MenuOperateDrawer from './modules/menu-operate-drawer.vue';

const { hasAuth } = useAuth();

// 使用箭头函数可以保持 label的国际化响应式
const menuSearchForm = useSearchForm<Api.SystemManage.MenuSearchParams>(() => [
  {
    key: 'title',
    label: $t('page.manage.menu.menuName'),
    type: 'Input',
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.menu.menuName')
    }
  },
  {
    key: 'path',
    label: $t('page.manage.menu.routePath'),
    type: 'Input',
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.menu.routePath')
    }
  },
  {
    key: 'status',
    label: $t('common.status'),
    type: 'Select',
    props: {
      placeholder: $t('common.pleaseSelect') + $t('common.status'),
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
  }
]);

const {
  columns,
  columnChecks,
  data,
  loading,
  getDataByPage,
  getData,
  searchParams,
  resetSearchParams,
  toggleExpand,
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
      fixed: 'left',
      key: 'title',
      title: $t('page.manage.menu.title'), // $t('page.manage.Menu.role'),
      align: 'left',
      width: 180,
      tree: true,
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
      title: $t('page.manage.menu.icon'),
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
      title: $t('page.manage.menu.menuType'), // $t('page.manage.Menu.role'),
      align: 'center',
      width: 100,
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
      title: $t('page.manage.menu.routePath'),
      align: 'center',
      width: 150,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'name',
      title: $t('page.manage.menu.routeName'),
      align: 'center',
      width: 150,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'component',
      title: $t('page.manage.menu.component'),
      align: 'center',
      width: 180,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'permission',
      title: $t('page.manage.menu.permission'),
      align: 'center',
      width: 150,
      ellipsis: {
        tooltip: true
      },
      render: row => {
        if (!row.permission) {
          return null;
        }
        return <NTag type={'primary'}>{row.permission}</NTag>;
      }
    },
    {
      key: 'order',
      title: $t('page.manage.menu.order'),
      align: 'center',
      width: 100
    },
    {
      key: 'keepAlive',
      title: $t('page.manage.menu.keepAlive'),
      align: 'center',
      width: 100,
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
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: getLocale.value === 'zh-CN' ? 220 : 260,
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

const detailColumns = useDetailDescriptions<Api.SystemManage.Menu>(() => [
  {
    key: 'type',
    label: $t('page.manage.menu.menuType'),
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
    label: $t('page.manage.menu.parent'),
    render: row => {
      if (!row.parentI18Key) return null;
      return $t(row.parentI18Key);
    }
  },
  {
    key: 'title',
    label: $t('page.manage.menu.title')
  },
  {
    key: 'i18nKey',
    label: $t('page.manage.menu.i18nKey')
  },
  {
    key: 'iconType',
    label: $t('page.manage.menu.iconTypeTitle'),
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
    label: $t('page.manage.menu.icon'),
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
    label: $t('page.manage.menu.routePath'),
    hide: (): boolean => {
      return isPermission();
    }
  },
  {
    key: 'name',
    label: $t('page.manage.menu.routeName'),
    hide: (): boolean => {
      return isPermission();
    }
  },
  {
    key: 'component',
    label: $t('page.manage.menu.component'),
    hide: (): boolean => {
      return isPermission() || hideComponent();
    }
  },
  {
    key: 'permission',
    label: $t('page.manage.menu.permission'),
    hide: () => {
      return !isPermission();
    }
  },
  {
    key: 'keepAlive',
    label: $t('page.manage.menu.keepAlive'),
    hide: (): boolean => {
      return isPermission();
    },
    render: row => {
      return row.keepAlive ? $t('common.yesOrNo.yes') : $t('common.yesOrNo.no');
    }
  },
  {
    key: 'hideInMenu',
    label: $t('page.manage.menu.hideInMenu'),
    hide: (): boolean => {
      return isPermission();
    },
    render: row => {
      return row.hideInMenu ? $t('common.yesOrNo.yes') : $t('common.yesOrNo.no');
    }
  },
  {
    key: 'activeMenu',
    label: $t('page.manage.menu.activeMenu'),
    hide: (row): boolean => {
      return !row.hideInMenu;
    }
  },
  {
    key: 'isExt',
    label: $t('page.manage.menu.isExt'),
    hide: (row): boolean => {
      return Boolean(row.hideInMenu) || isPermission();
    },
    render: row => {
      return row.isExt ? $t('common.yesOrNo.yes') : $t('common.yesOrNo.no');
    }
  },
  {
    key: 'extOpenMode',
    label: '',
    hide: (row): boolean => {
      return !row.isExt;
    },
    render: row => {
      return row.extOpenMode === 0 ? $t('page.manage.menu.inner') : $t('page.manage.menu.black');
    }
  },
  {
    key: 'href',
    label: $t('page.manage.menu.href'),
    hide: (row): boolean => {
      return !row.isExt;
    }
  },
  {
    key: 'multiTab',
    label: $t('page.manage.menu.multiTab'),
    hide: (row): boolean => {
      return isPermission() || row.extOpenMode === 1;
    },
    render: row => {
      return row.multiTab ? $t('common.yesOrNo.yes') : $t('common.yesOrNo.no');
    }
  },
  {
    key: 'fixedIndexInTab',
    label: $t('page.manage.menu.fixedIndexInTab'),
    hide: (row): boolean => {
      return isPermission() || row.extOpenMode === 1;
    }
  },
  {
    key: 'order',
    label: $t('page.manage.menu.order')
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
]);

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
  if (hasAuth('system:menu:read')) {
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
    <NCard :bordered="false" size="small" class="flex-1 card-wrapper">
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
          @toggle-expand="toggleExpand"
        />
        <NDataTable
          v-model:expanded-row-keys="expandedRowKeys"
          :columns="columns"
          :data="data"
          size="small"
          :loading="loading"
          remote
          flex-height
          virtual-scroll
          :row-key="row => row.id"
          class="min-h-300px flex-1"
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
      :title="$t('page.manage.menu.detail')"
      width="60%"
      :fields="detailColumns"
      :data="detailData"
    />
  </div>
</template>

<style scoped></style>
