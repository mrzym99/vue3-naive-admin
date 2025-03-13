<script setup lang="tsx">
import { NTime } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import type { SearchFormType } from '@/components/advanced/search-form';
import { fetchBatchDeleteLoginLog, fetchGetLoginLogList } from '@/service/api';

const appStore = useAppStore();

const userSearchForm: SearchFormType<Api.SystemManage.LoginLogSearchParams> = [
  {
    key: 'username',
    label: '用户名',
    type: 'Input',
    props: {
      placeholder: '请输入用户名'
    }
  },
  {
    key: 'ip',
    label: 'IP',
    type: 'Input',
    props: {
      placeholder: '请输入IP'
    }
  },
  {
    key: 'address',
    label: '登录地点',
    type: 'Input',
    props: {
      placeholder: '请输入登录地点'
    }
  },
  {
    key: 'time',
    label: '登录时间',
    type: 'DatePicker',
    props: {
      type: 'daterange',
      placeholder: '请输入选择登录时间范围'
    }
  }
];

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
        title: '用户名',
        align: 'left',
        width: 150,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'nickName',
        title: '昵称',
        align: 'center',
        width: 150,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'ip',
        title: 'IP',
        align: 'center',
        width: 200,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'address',
        title: '登录地点', // $t('page.manage.user.userGender'),
        align: 'center',
        width: 280
      },
      {
        key: 'time',
        title: '登录时间',
        width: 200,
        render: row => {
          if (row.time === null) return null;
          return <NTime time={new Date(row.time)} />;
        }
      },
      {
        key: 'os',
        title: '操作系统',
        align: 'center',
        width: 120
      },
      {
        key: 'browser',
        title: '浏览器', // $t('page.manage.user.role'),
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
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
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
