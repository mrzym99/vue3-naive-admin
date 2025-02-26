<script setup lang="tsx">
import { NButton, NPopconfirm, NTime } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchDeleteParameter, fetchGetParameterInfo, fetchGetParameterList } from '@/service/api';
import { $t } from '@/locales';
import type { SearchFormType } from '@/components/advanced/search-form';
import ParameterOperateDrawer from './modules/parameter-operate-drawer.vue';

const appStore = useAppStore();

const parameterSearchForm: SearchFormType = [
  {
    key: 'name',
    label: '参数名称',
    type: 'Input',
    props: {
      placeholder: '请输入参数名称'
    }
  }
];

const { columns, columnChecks, data, loading, pagination, getDataByPage, getData, searchParams, resetSearchParams } =
  useTable({
    apiFn: fetchGetParameterList,
    showTotal: true,
    apiParams: {
      currentPage: 1,
      pageSize: 10,
      name: ''
    },
    columns: () => [
      {
        key: 'name',
        title: '参数名称', // $t('page.manage.parameter.parameter'),
        align: 'left',
        width: 200
      },
      {
        key: 'key',
        title: 'Key', // $t('page.manage.parameter.parameter'),
        align: 'center',
        width: 200
      },
      {
        key: 'value',
        title: '参数值', // $t('page.manage.parameter.parameter'),
        width: 120,
        align: 'center'
      },
      {
        key: 'remark',
        title: '备注', // $t('page.manage.parameter.parameter'),
        width: 200,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'updatedAt',
        title: '更新时间',
        width: 180,
        render: row => {
          return <NTime time={new Date(row.updatedAt)} />;
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
          </div>
        )
      }
    ]
  });

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, onDeleted } = useTableOperate(data, getData);

async function edit(id: string) {
  const { error, data: parameterInfo } = await fetchGetParameterInfo(id);
  if (error) {
    return;
  }
  handleEdit(id, parameterInfo as any);
}

async function handleDelete(id: string) {
  const { error } = await fetchDeleteParameter(id);
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
          :fields="parameterSearchForm"
          @search="getDataByPage"
          @reset="resetSearchParams"
        />
        <TableHeaderOperation
          v-model:columns="columnChecks"
          prefix="system:parameter"
          :hide-delete="true"
          :loading="loading"
          @add="handleAdd"
          @refresh="getData"
        />
        <NDataTable
          :columns="columns"
          :data="data"
          size="small"
          :flex-height="!appStore.isMobile"
          :loading="loading"
          :pagination="pagination"
          remote
          :row-key="row => row.id"
          class="sm:h-full"
        />
      </div>
    </NCard>
    <ParameterOperateDrawer
      v-model:visible="drawerVisible"
      :operate-type="operateType"
      :row-data="editingData"
      @submitted="getDataByPage"
    />
  </div>
</template>

<style scoped></style>
