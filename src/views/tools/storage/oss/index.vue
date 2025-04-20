<script setup lang="tsx">
import { NTag, NTime } from 'naive-ui';
import { useTable } from '@/hooks/common/table';
import { fetchGetStorageOssList } from '@/service/api';
import { $t } from '@/locales';
import { useSearchForm } from '@/hooks/common/search-form';
import { getTableScrollX } from '@/utils/common';
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore();
const storageOssSearchForm = useSearchForm<Api.ToolsManage.StorageOssSearchParams>(() => [
  {
    key: 'name',
    label: $t('page.tools.storage.fileName'),
    type: 'Input',
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.tools.storage.fileName')
    }
  }
]);

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
        title: $t('page.tools.storage.fileName'),
        align: 'left',
        width: 200,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'extName',
        title: $t('page.tools.storage.fileExt'),
        align: 'center',
        width: 100
      },
      {
        key: 'type',
        title: $t('page.tools.storage.fileType'),
        align: 'center',
        width: 120,
        render: row => {
          if (row.type === null) return null;
          return <NTag>{row.type}</NTag>;
        }
      },
      {
        key: 'size',
        title: $t('page.tools.storage.size'),
        align: 'center',
        width: 100
      },
      {
        key: 'lastModified',
        title: $t('page.tools.storage.lastModified'),
        align: 'center',
        width: 200,
        ellipsis: {
          tooltip: true
        },
        render: row => {
          return <NTime time={new Date(row.lastModified)} />;
        }
      },
      {
        key: 'url',
        title: $t('page.tools.storage.path'),
        align: 'center',
        width: 200,
        ellipsis: {
          tooltip: true
        }
      }
    ]
  });
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden">
    <NCard :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header>
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
      </template>
      <NDataTable
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :loading="loading"
        :pagination="pagination"
        :scroll-x="getTableScrollX(columns)"
        remote
        :row-key="row => row.id"
        class="sm:h-full"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
