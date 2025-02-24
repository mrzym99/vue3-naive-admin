<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchDeleteDept, fetchGetDeptList, fetchSetDeptDefault } from '@/service/api';
import { $t } from '@/locales';
import type { SearchFormType } from '@/components/advanced/search-form';
import DeptOperateDrawer from './modules/dept-operate-drawer.vue';

const appStore = useAppStore();

const deptSearchForm: SearchFormType = [
  {
    key: 'name',
    label: '部门名称',
    type: 'Input',
    props: {
      placeholder: '请输入部门名称'
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
      key: 'default',
      title: '默认部门',
      align: 'center',
      width: 120,
      render: row => {
        if (!row.default) {
          return null;
        }

        return <NTag type={'primary'}>是</NTag>;
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
          {row.default ? (
            ''
          ) : (
            <NPopconfirm onPositiveClick={() => handleSetDefault(row.id)}>
              {{
                default: () => '设置为默认',
                trigger: () => (
                  <NButton type={'tertiary'} ghost size="small">
                    设为默认
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

function edit(id: string) {
  handleEdit(id);
}

async function handleDelete(id: string) {
  const { error } = await fetchDeleteDept(id);
  if (!error) {
    onDeleted();
  }
}

async function handleSetDefault(id: string) {
  const { error } = await fetchSetDeptDefault(id);
  if (!error) {
    window.$message?.success('设为默认成功');
    getDataByPage();
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
    <DeptOperateDrawer
      v-model:visible="drawerVisible"
      :operate-type="operateType"
      :row-data="editingData"
      @submitted="getDataByPage"
    />
  </div>
</template>

<style scoped></style>
