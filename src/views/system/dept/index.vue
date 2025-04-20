<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchDeleteDept, fetchGetDeptList, fetchSetDeptDefault } from '@/service/api';
import { $t } from '@/locales';
import { useAuth } from '@/hooks/business/auth';
import { useSearchForm } from '@/hooks/common/search-form';
import { getTableScrollX } from '@/utils/common';
import { useAppStore } from '@/store/modules/app';
import DeptOperateDrawer from './modules/dept-operate-drawer.vue';

const appStore = useAppStore();

const { hasAuth } = useAuth();

const deptSearchForm = useSearchForm<Api.SystemManage.DeptSearchParams>(() => [
  {
    key: 'name',
    label: $t('page.manage.dept.name'),
    type: 'Input',
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.dept.name')
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
  apiFn: fetchGetDeptList,
  showTotal: true,
  isTreeTable: true,
  expandAll: true,
  apiParams: {
    currentPage: 1,
    pageSize: 999,
    name: ''
  },
  columns: () => [
    {
      fixed: 'left',
      key: 'name',
      title: $t('page.manage.dept.name'),
      align: 'left',
      width: 180,
      tree: true,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'order',
      title: $t('page.manage.common.order'),
      align: 'center',
      width: 180
    },
    {
      key: 'default',
      title: $t('page.manage.dept.default'),
      align: 'center',
      width: 180,
      render: row => {
        if (!row.default) {
          return null;
        }

        return <NTag type={'primary'}>{$t('common.yesOrNo.yes')}</NTag>;
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 220,
      render: row => (
        <div class="flex justify-items-start gap-8px">
          <NButton
            disabled={!hasAuth('system:dept:update')}
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
                <NButton disabled={!hasAuth('system:dept:delete')} type="error" ghost size="small">
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
          {row.default ? (
            ''
          ) : (
            <NPopconfirm onPositiveClick={() => handleSetDefault(row.id)}>
              {{
                default: () => $t('common.setDefault'),
                trigger: () => (
                  <NButton disabled={!hasAuth('system:dept:update')} type={'tertiary'} ghost size="small">
                    {$t('common.setDefault')}
                  </NButton>
                )
              }}
            </NPopconfirm>
          )}
        </div>
      )
    }
  ]
});

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, onDeleted } = useTableOperate(data, getData);

function edit(id: number) {
  handleEdit(id);
}

async function handleDelete(id: number) {
  const { error } = await fetchDeleteDept(id);
  if (!error) {
    onDeleted();
  }
}

async function handleSetDefault(id: number) {
  const { error } = await fetchSetDeptDefault(id);
  if (!error) {
    window.$message?.success($t('common.operateSuccess'));
    getDataByPage();
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden">
    <NCard :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header>
        <SearchForm
          v-model:model="searchParams"
          :fields="deptSearchForm"
          @search="getDataByPage"
          @reset="resetSearchParams"
        />
        <TableHeaderOperation
          v-model:columns="columnChecks"
          prefix="system:dept"
          :hide-delete="true"
          :loading="loading"
          :tree-table="isTreeTable"
          @add="handleAdd"
          @refresh="getData"
          @toggle-expand="toggleExpand"
        />
      </template>
      <NDataTable
        v-model:expanded-row-keys="expandedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :loading="loading"
        :scroll-x="getTableScrollX(columns)"
        remote
        :row-key="row => row.id"
        class="sm:h-full"
      />
      <DeptOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
