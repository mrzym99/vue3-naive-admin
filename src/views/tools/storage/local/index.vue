<script setup lang="tsx">
import { NButton, NImage, NPopconfirm, NTag, NTime } from 'naive-ui';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchDeleteStorageLocal, fetchGetStorageLocalList } from '@/service/api';
import { $t } from '@/locales';
import { useAuth } from '@/hooks/business/auth';
import { useSearchForm } from '@/hooks/common/search-form';
const { hasAuth } = useAuth();

const storageLocalSearchForm = useSearchForm<Api.ToolsManage.StorageLocalSearchParams>(() => [
  {
    key: 'name',
    label: $t('page.tools.storage.fileName'),
    type: 'Input',
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.tools.storage.fileName')
    }
  },
  {
    key: 'username',
    label: $t('page.tools.storage.uploadBy'),
    type: 'Input',
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.tools.storage.uploadBy')
    }
  },
  {
    key: 'time',
    label: $t('page.tools.storage.uploadTime'),
    type: 'DatePicker',
    props: {
      type: 'daterange'
    }
  }
]);

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
        type: 'selection',
        align: 'center',
        width: 48
      },
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
        key: 'path',
        title: $t('page.tools.storage.preview'),
        align: 'center',
        width: 120,
        render: row => {
          if (row.type === 'image') return <NImage width={60} src={row.path} />;
          return <NTag>{row.name}</NTag>;
        }
      },
      {
        key: 'size',
        title: $t('page.tools.storage.size'),
        align: 'center',
        width: 100
      },
      {
        key: 'createdAt',
        title: $t('page.tools.storage.uploadTime'),
        align: 'center',
        minWidth: 100,
        render: row => {
          if (!row.createdAt) return null;
          return <NTime time={new Date(row.createdAt)} />;
        }
      },
      {
        key: 'username',
        title: $t('page.tools.storage.uploadBy'),
        align: 'center',
        minWidth: 100
      },
      {
        key: 'operate',
        title: $t('common.operate'),
        align: 'center',
        width: 130,
        render: row => (
          <div class="flex-center gap-8px">
            <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
              {{
                default: () => `${$t('common.delete')} - ${row.name} ？`,
                trigger: () => (
                  <NButton disabled={!hasAuth('tool:storage:delete')} type={'error'} ghost size="small">
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

const { checkedRowKeys } = useTableOperate(data, getData);

async function handleDelete(id: string) {
  const { error } = await fetchDeleteStorageLocal([id]);
  if (!error) {
    window.$message?.success($t('common.deleteSuccess'));
    getDataByPage();
  }
}

async function handleBatchDelete() {
  const { error } = await fetchDeleteStorageLocal(checkedRowKeys.value as string[]);
  if (!error) {
    window.$message?.success($t('common.deleteSuccess'));
    getDataByPage();
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden">
    <NCard :bordered="false" size="small" class="flex-1 card-wrapper">
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
          @delete="handleBatchDelete"
          @refresh="getData"
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
