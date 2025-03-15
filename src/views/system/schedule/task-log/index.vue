<script setup lang="tsx">
import { NTag, NTime } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchBatchDeleteTaskLog, fetchGetTaskLogList } from '@/service/api';
import { $t } from '@/locales';
import type { SearchFormType } from '@/components/advanced/search-form';
import { successOrFailRecord } from '@/constants/common';

const appStore = useAppStore();

const taskLogSearchForm: SearchFormType<Api.SystemManage.TaskLogSearchParams> = [
  {
    key: 'name',
    label: '任务名称',
    type: 'Input',
    props: {
      placeholder: '请输入任务名称'
    }
  },
  {
    key: 'status',
    label: '状态',
    type: 'Select',
    props: {
      options: [],
      placeholder: '请选择任务状态'
    }
  }
];

const { columns, columnChecks, data, getData, loading, pagination, getDataByPage, searchParams, resetSearchParams } =
  useTable({
    apiFn: fetchGetTaskLogList,
    showTotal: true,
    apiParams: {
      currentPage: 1,
      pageSize: 10,
      name: '',
      status: null
    },
    columns: () => [
      {
        fixed: 'left',
        type: 'selection',
        width: 48
      },
      {
        key: 'taskId',
        title: '任务id', // $t('page.manage.taskLog.taskLog'),
        align: 'left',
        width: 120,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'name',
        title: '任务名称', // $t('page.manage.taskLog.taskLog'),
        width: 150,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'status',
        title: $t('common.status'),
        align: 'center',
        width: 60,
        render: row => {
          if (row.status === null) {
            return null;
          }

          const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
            1: 'success',
            0: 'error'
          };

          const label = $t(successOrFailRecord[row.status]);

          return <NTag type={tagMap[row.status]}>{label}</NTag>;
        }
      },
      {
        key: 'consumeTime',
        title: '耗时',
        align: 'center',
        width: 100
      },

      {
        key: 'detail',
        title: '失败详情',
        width: 220,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'createdAt',
        title: '任务发起时间',
        width: 200,
        render: row => {
          if (!row.createdAt) return null;
          return <NTime time={new Date(row.createdAt)} />;
        }
      }
    ]
  });

const { checkedRowKeys, onBatchDeleted } = useTableOperate(data, getData);

async function batchDelete() {
  const { error } = await fetchBatchDeleteTaskLog(checkedRowKeys.value as string[]);
  if (!error) {
    onBatchDeleted();
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <div class="h-full flex-col-stretch">
        <SearchForm
          v-model:model="searchParams"
          :fields="taskLogSearchForm"
          @search="getDataByPage"
          @reset="resetSearchParams"
        />
        <TableHeaderOperation
          v-model:columns="columnChecks"
          prefix="system:taskLog"
          :hide-add="true"
          :loading="loading"
          :disabled-delete="checkedRowKeys.length === 0"
          @refresh="getDataByPage"
          @delete="batchDelete"
        />
        <NDataTable
          v-model:checked-row-keys="checkedRowKeys"
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
  </div>
</template>

<style scoped></style>
