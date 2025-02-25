<script setup lang="tsx">
import { NTag, NTime } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';
import { useTable } from '@/hooks/common/table';
import type { SearchFormType } from '@/components/advanced/search-form';
import { fetchGetLoginLogList } from '@/service/api';

const appStore = useAppStore();

const userSearchForm: SearchFormType = [
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
    label: '登录地址',
    type: 'Input',
    props: {
      placeholder: '请输入登录地址'
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

const { columns, data, loading, pagination, getDataByPage, getData, searchParams, resetSearchParams } = useTable({
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
      key: 'username',
      title: '用户名',
      align: 'left',
      width: 180,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'ip',
      title: 'IP',
      align: 'center',
      width: 180,
      render: row => {
        if (row.ip === null) return null;
        return <NTag>{row.ip}</NTag>;
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
          prefix="system:login-log"
          :hide-delete="true"
          :hide-add="true"
          :loading="loading"
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
  </div>
</template>

<style scoped></style>
