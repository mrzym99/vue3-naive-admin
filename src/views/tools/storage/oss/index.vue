<script setup lang="tsx">
import { NTag, NTime } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';
import { useTable } from '@/hooks/common/table';
import { fetchGetStorageOssList } from '@/service/api';
import type { SearchFormType } from '@/components/advanced/search-form';
const appStore = useAppStore();

const storageOssSearchForm: SearchFormType<Api.ToolsManage.StorageOssSearchParams> = [
  {
    key: 'name',
    label: '文件名',
    type: 'Input',
    props: {
      placeholder: '请输入文件名'
    }
  }
];

const { columns, columnChecks, searchParams, data, loading, pagination, getData, getDataByPage, resetSearchParams } =
  useTable({
    apiFn: fetchGetStorageOssList,
    showTotal: true,
    apiParams: {
      currentPage: 1,
      pageSize: 10,
      name: ''
      // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
      // the value can not be undefined, otherwise the property in Form will not be reactive
    },
    columns: () => [
      {
        key: 'name',
        title: '文件名',
        align: 'left',
        width: 200,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'extName',
        title: '文件扩展名',
        align: 'center',
        width: 100
      },
      {
        key: 'type',
        title: '文件类型',
        align: 'center',
        width: 120,
        render: row => {
          if (row.type === null) return null;
          return <NTag>{row.type}</NTag>;
        }
      },
      {
        key: 'size',
        title: '文件大小',
        align: 'center',
        width: 100
      },
      {
        key: 'lastModified',
        title: '最近修改时间',
        align: 'center',
        minWidth: 100,
        render: row => {
          return <NTime time={new Date(row.lastModified)} />;
        }
      },
      {
        key: 'url',
        title: '访问路径',
        align: 'center',
        ellipsis: {
          tooltip: true
        }
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
          :fields="storageOssSearchForm"
          @search="getDataByPage"
          @reset="resetSearchParams"
        />
        <TableHeaderOperation
          v-model:columns="columnChecks"
          prefix="system:online"
          :hide-add="true"
          :hide-delete="true"
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
