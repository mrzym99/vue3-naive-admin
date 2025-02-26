<script setup lang="tsx">
import { NButton, NImage, NPopconfirm, NTag, NTime } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchDeleteStorageLocal, fetchGetStorageLocalList } from '@/service/api';
import { $t } from '@/locales';
import type { SearchFormType } from '@/components/advanced/search-form';

const appStore = useAppStore();

const storageLocalSearchForm: SearchFormType = [
  {
    key: 'name',
    label: '文件名',
    type: 'Input',
    props: {
      placeholder: '请输入文件名'
    }
  },
  {
    key: 'username',
    label: '上传者',
    type: 'Input',
    props: {
      placeholder: '请输入上传者'
    }
  },
  {
    key: 'time',
    label: '上传时间',
    type: 'DatePicker',
    props: {
      type: 'daterange',
      placeholder: '请选择上传时间'
    }
  }
];

const { columns, columnChecks, data, loading, pagination, getDataByPage, getData, searchParams, resetSearchParams } =
  useTable({
    apiFn: fetchGetStorageLocalList,
    showTotal: true,
    apiParams: {
      currentPage: 1,
      pageSize: 10,
      // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
      // the value can not be undefined, otherwise the property in Form will not be reactive
      username: null,
      time: null,
      name: null
    },
    columns: () => [
      {
        fixed: 'left',
        type: 'selection',
        align: 'center',
        width: 48
      },
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
        key: 'path',
        title: '文件预览',
        align: 'center',
        width: 120,
        render: row => {
          if (row.type === 'image') return <NImage width={60} src={row.path} />;
          return <NTag>{row.name}</NTag>;
        }
      },
      {
        key: 'size',
        title: '文件大小',
        align: 'center',
        width: 100
      },
      {
        key: 'createdAt',
        title: '上传时间',
        align: 'center',
        minWidth: 100,
        render: row => {
          return <NTime time={new Date(row.createdAt)} />;
        }
      },
      {
        key: 'username',
        title: '上传者',
        align: 'center',
        minWidth: 100
      },
      {
        fixed: 'right',
        key: 'operate',
        title: $t('common.operate'),
        align: 'center',
        width: 130,
        render: row => (
          <div class="flex-center gap-8px">
            <NPopconfirm onPositiveClick={() => handleDelete([row.id])}>
              {{
                default: () => `删除文件 - ${row.name} ？`,
                trigger: () => (
                  <NButton type={'error'} ghost size="small">
                    删除
                  </NButton>
                )
              }}
            </NPopconfirm>
          </div>
        )
      }
    ]
  });

const { checkedRowKeys } = useTableOperate(data, getData);

async function handleDelete(ids: string[]) {
  const { error } = await fetchDeleteStorageLocal(ids);
  if (!error) {
    window.$message?.success('删除');
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
          :fields="storageLocalSearchForm"
          @search="getDataByPage"
          @reset="resetSearchParams"
        />
        <TableHeaderOperation
          v-model:columns="columnChecks"
          prefix="system:online"
          :hide-add="true"
          :loading="loading"
          :disabled-delete="checkedRowKeys.length === 0"
          @delete="handleDelete(checkedRowKeys)"
          @refresh="getData"
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
