<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { Icon } from '@iconify/vue';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchDeleteMenu, fetchGetMenuList } from '@/service/api';
import { $t } from '@/locales';
import type { SearchFormType } from '@/components/advanced/search-form';
import { enableStatusRecord, menuTypeRecord } from '@/constants/business';
import MenuOperateDrawer from './modules/menu-operate-drawer.vue';

const appStore = useAppStore();

const MenuSearchForm: SearchFormType = [
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
      options: Object.entries(enableStatusRecord).map(([key, value]) => ({
        label: $t(value),
        value: key
      }))
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
      fixed: 'left'
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
            <NButton type="success" ghost size="small" onClick={() => add(row.id, 1)}>
              {$t('page.manage.menu.addChildMenu')}
            </NButton>
          )}
          {row.type === 1 && (
            <NButton type="error" ghost size="small" onClick={() => add(row.id, 2)}>
              {$t('page.manage.menu.addPermission')}
            </NButton>
          )}
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" ghost size="small">
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

const { drawerVisible, operateType, addingData, editingData, handleAdd, handleEdit, onDeleted } = useTableOperate(
  data,
  getData
);
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
          :fields="MenuSearchForm"
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
  </div>
</template>

<style scoped></style>
