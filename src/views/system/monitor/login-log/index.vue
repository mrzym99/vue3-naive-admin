<script setup lang="tsx">
import { NTime } from 'naive-ui';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchBatchDeleteLoginLog, fetchGetLoginLogList } from '@/service/api';
import { $t } from '@/locales';
import { useSearchForm } from '@/hooks/common/search-form';

const userSearchForm = useSearchForm<Api.SystemManage.LoginLogSearchParams>(() => [
  {
    key: 'username',
    label: $t('page.manage.user.username'),
    type: 'Input',
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.user.username')
    }
  },
  {
    key: 'ip',
    label: $t('page.manage.online.ip'),
    type: 'Input',
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.online.ip')
    }
  },
  {
    key: 'address',
    label: $t('page.manage.loginLog.address'),
    type: 'Input',
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.loginLog.address')
    }
  },
  {
    key: 'time',
    label: $t('page.manage.loginLog.loginTime'),
    type: 'DatePicker',
    props: {
      type: 'daterange'
    }
  }
]);

const { columns, columnChecks, data, loading, pagination, getDataByPage, getData, searchParams, resetSearchParams } =
  useTable({
    apiFn: fetchGetLoginLogList,
    showTotal: true,
    apiParams: {
      currentPage: 1,
      pageSize: 10,
      // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
      // the value can not be undefined, otherwise the property in Form will not be reactive
      username: '',
      address: '',
      ip: '',
      time: null
    },
    columns: () => [
      {
        fixed: 'left',
        type: 'selection',
        width: 48
      },
      {
        key: 'username',
        title: $t('page.manage.user.username'),
        width: 150,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'nickName',
        title: $t('page.manage.user.nickName'),
        align: 'center',
        width: 150,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'ip',
        title: $t('page.manage.online.ip'),
        align: 'center',
        width: 200,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'address',
        title: $t('page.manage.loginLog.address'),
        align: 'center',
        width: 280
      },
      {
        key: 'time',
        title: $t('page.manage.loginLog.loginTime'),
        width: 200,
        render: row => {
          if (row.time === null) return null;
          return <NTime time={new Date(row.time)} />;
        }
      },
      {
        key: 'os',
        title: $t('page.manage.loginLog.os'),
        align: 'center',
        width: 120
      },
      {
        key: 'browser',
        title: $t('page.manage.loginLog.browser'),
        align: 'center',
        width: 200
      }
    ]
  });
const { checkedRowKeys, onBatchDeleted } = useTableOperate(data, getData);

async function batchDelete() {
  const { error } = await fetchBatchDeleteLoginLog(checkedRowKeys.value as string[]);
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
          :fields="userSearchForm"
          @search="getDataByPage"
          @reset="resetSearchParams"
        />
        <TableHeaderOperation
          v-model:columns="columnChecks"
          prefix="system:login-log"
          :hide-add="true"
          :loading="loading"
          :disabled-delete="checkedRowKeys.length === 0"
          @refresh="getData"
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
