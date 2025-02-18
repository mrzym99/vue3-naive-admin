<script setup lang="tsx">
import { NButton, NPopconfirm } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchDeleteDept, fetchGetDeptList } from '@/service/api';
import { $t } from '@/locales';
import DeptOperateDrawer from './modules/dept-operate-drawer.vue';

const appStore = useAppStore();

const deptSearchForm: Form.SearchForm = [
  {
    key: 'name',
    label: '部门名称',
    type: 'input',
    placeholder: '请输入部门名称',
    options: []
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
  apiFn: fetchGetDeptList,
  showTotal: true,
  isTreeTable: true,
  apiParams: {
    currentPage: 1,
    pageSize: 999,
    name: ''
  },
  columns: () => [
    {
      fixed: 'left',
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'name',
      title: '部门名称', // $t('page.manage.dept.role'),
      align: 'left',
      minWidth: 100,
      tree: true
    },
    {
      key: 'order',
      title: '排序',
      align: 'center',
      width: 100
    },
    {
      fixed: 'right',
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => (
        <div class="flex-center gap-8px">
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

const { drawerVisible, checkedRowKeys, operateType, editingData, handleAdd, handleEdit, onDeleted, onBatchDeleted } =
  useTableOperate(data, getData);

async function handleBatchDelete() {
  // request
  console.log(checkedRowKeys.value);

  onBatchDeleted();
}

function edit(id: string) {
  handleEdit(id);
}

async function handleDelete(id: string) {
  const { error } = await fetchDeleteDept(id);
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
          :fields="deptSearchForm"
          @search="getDataByPage"
          @reset="resetSearchParams"
        />
        <TableHeaderOperation
          v-model:columns="columnChecks"
          prefix="system:dept"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :tree-table="isTreeTable"
          @add="handleAdd"
          @delete="handleBatchDelete"
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
    <DeptOperateDrawer
      v-model:visible="drawerVisible"
      :operate-type="operateType"
      :row-data="editingData"
      @submitted="getDataByPage"
    />
  </div>
</template>

<style scoped></style>
