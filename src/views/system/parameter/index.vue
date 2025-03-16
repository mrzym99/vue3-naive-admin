<script setup lang="tsx">
import { NButton, NPopconfirm, NTime } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchDeleteParameter, fetchGetParameterInfo, fetchGetParameterList } from '@/service/api';
import { $t } from '@/locales';
import { useAuth } from '@/hooks/business/auth';
import { useSearchForm } from '@/hooks/common/search-form';
import ParameterOperateDrawer from './modules/parameter-operate-drawer.vue';

const appStore = useAppStore();
const { hasAuth } = useAuth();

const parameterSearchForm = useSearchForm<Api.SystemManage.ParameterSearchParams>(() => [
  {
    key: 'name',
    label: $t('page.manage.parameter.name'),
    type: 'Input',
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.parameter.name')
    }
  }
]);

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
        title: $t('page.manage.parameter.name'),
        align: 'left',
        width: 200
      },
      {
        key: 'key',
        title: $t('page.manage.parameter.key'),
        align: 'center',
        width: 200
      },
      {
        key: 'value',
        title: $t('page.manage.parameter.value'),
        width: 120,
        align: 'center'
      },
      {
        key: 'remark',
        title: $t('page.manage.common.remark'),
        width: 200,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'updatedAt',
        title: $t('common.updatedAt'),
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
        width: 120,
        render: row => (
          <div class="flex justify-items-start gap-8px">
            <NButton
              disabled={!hasAuth('system:parameter:update')}
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
                  <NButton disabled={!hasAuth('system:parameter:delete')} type="error" ghost size="small">
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
    window.$message?.success($t('common.deleteSuccess'));
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
