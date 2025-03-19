<script setup lang="tsx">
import { NTag, NTime } from 'naive-ui';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchBatchDeleteTaskLog, fetchGetTaskLogList } from '@/service/api';
import { $t } from '@/locales';
import type { SearchFormType } from '@/components/advanced/search-form';
import { successOrFailRecord } from '@/constants/common';
import { StatusEnum } from '@/constants/enum';

const taskLogSearchForm: SearchFormType<Api.SystemManage.TaskLogSearchParams> = [
  {
    key: 'name',
    label: $t('page.manage.taskLog.name'),
    type: 'Input',
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.taskLog.name')
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
        title: $t('page.manage.taskLog.id'),
        align: 'left',
        width: 120,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'name',
        title: $t('page.manage.taskLog.name'),
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
        title: $t('page.manage.taskLog.consume'),
        align: 'center',
        width: 100
      },
      {
        key: 'detail',
        title: $t('page.manage.taskLog.failDetail'),
        width: 220,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'createdAt',
        title: $t('page.manage.taskLog.startTime'),
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
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden">
    <NCard :bordered="false" size="small" class="flex-1 card-wrapper">
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
          flex-height
          :loading="loading"
          :pagination="pagination"
          remote
          :row-key="row => row.id"
          class="flex-1"
        />
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>
