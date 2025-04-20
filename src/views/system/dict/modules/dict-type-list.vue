<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { watch } from 'vue';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t, getLocale } from '@/locales';
import { useAuth } from '@/hooks/business/auth';
import { generatePrefix, getTableScrollX } from '@/utils/common';
import { useSearchForm } from '@/hooks/common/search-form';
import { fetchBatchUpdateDictTypeStatus, fetchDeleteDictType, fetchGetDictTypeList } from '@/service/api';
import { StatusEnum } from '@/constants/enum';
import { useAppStore } from '@/store/modules/app';
import DictTypeOperateDrawer from './dict-type-operate-drawer.vue';

const { hasAuth } = useAuth();
const appStore = useAppStore();

interface Emits {
  (e: 'change', row: Api.SystemManage.DictType): void;
}

const emit = defineEmits<Emits>();

const dictTypeSearchForm = useSearchForm<Api.SystemManage.DictTypeSearchParams>(() => [
  {
    key: 'name',
    label: $t('page.manage.dict.name'),
    type: 'Input',
    span: appStore.isMobile ? 24 : 8,
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.dict.name')
    }
  },
  {
    key: 'code',
    label: $t('page.manage.dict.code'),
    type: 'Input',
    span: appStore.isMobile ? 24 : 8,
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.dict.value')
    }
  }
]);

const { columns, columnChecks, data, loading, pagination, getDataByPage, getData, searchParams, resetSearchParams } =
  useTable({
    apiFn: fetchGetDictTypeList,
    showTotal: true,
    apiParams: {
      currentPage: 1,
      pageSize: 10,
      // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
      // the value can not be undefined, otherwise the property in Form will not be reactive
      name: '',
      code: ''
    },
    columns: () => [
      {
        fixed: 'left',
        type: 'selection',
        align: 'center',
        width: 48
      },
      {
        fixed: 'left',
        key: 'name',
        title: $t('page.manage.dict.name'),
        align: 'center',
        width: 80,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'code',
        title: $t('page.manage.dict.code'),
        align: 'center',
        width: 80,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'status',
        title: $t('common.status'),
        width: 80,
        render: row => {
          return (
            <NTag type={row.status === StatusEnum.ENABLE ? 'success' : 'error'}>
              {row.status === StatusEnum.ENABLE ? $t('common.enable') : $t('common.disable')}
            </NTag>
          );
        }
      },
      {
        key: 'operate',
        title: $t('common.operate'),
        align: 'center',
        width: getLocale.value === 'zh-CN' ? 100 : 160,
        render: row => (
          <div class="flex-center gap-8px">
            <NButton
              disabled={!hasAuth('system:dict-type:update')}
              type="primary"
              ghost
              size="small"
              onClick={() => edit(row.id)}
            >
              {$t('common.edit')}
            </NButton>
            <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
              {{
                default: () => `${$t('common.delete')} - ${row.name} ？`,
                trigger: () => (
                  <NButton disabled={!hasAuth('system:dict-type:delete')} type={'error'} ghost size="small">
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

const { drawerVisible, checkedRowKeys, operateType, editingData, handleAdd, handleEdit, onDeleted } = useTableOperate(
  data,
  getData
);

function edit(id: number) {
  handleEdit(id);
}

function handleRowClick(row: Api.SystemManage.DictType) {
  return {
    style: 'cursor: pointer;',
    onClick: () => {
      emit('change', row);
    }
  };
}
async function handleBatchDChangeStatus() {
  const { error } = await fetchBatchUpdateDictTypeStatus({
    ids: checkedRowKeys.value as number[],
    status: 0
  });
  if (!error) {
    window.$message?.success($t('common.operateSuccess'));
  }
  // request
  getDataByPage();
}

async function handleDelete(id: number) {
  const { error } = await fetchDeleteDictType(id);
  if (!error) {
    onDeleted();
  }
}

watch(
  () => data.value,
  val => {
    if (val.length) {
      emit('change', val[0]);
    }
  }
);
</script>

<template>
  <div class="h-full flex-col-stretch px-10px lt-sm:h-70vh">
    <h3 class="mb-1 font-bold">{{ $t('page.manage.dict.dictType.title') }}</h3>
    <SearchForm
      v-model:model="searchParams"
      :fields="dictTypeSearchForm"
      @search="getDataByPage"
      @reset="resetSearchParams"
    />
    <TableHeaderOperation
      v-model:columns="columnChecks"
      prefix="system:user"
      :loading="loading"
      :hide-delete="true"
      @add="handleAdd"
      @refresh="getData"
    >
      <NPopconfirm
        v-if="hasAuth(generatePrefix('system:dict-item', 'update'))"
        @positive-click="handleBatchDChangeStatus"
      >
        <template #trigger>
          <NButton type="error" ghost size="small" :disabled="checkedRowKeys.length === 0">
            {{ $t('common.batchDisable') }}
          </NButton>
        </template>
        {{ `${$t('common.batchDisable')}?` }}
      </NPopconfirm>
    </TableHeaderOperation>
    <NDataTable
      v-model:checked-row-keys="checkedRowKeys"
      :columns="columns"
      :data="data"
      size="small"
      :flex-height="!appStore.isMobile"
      :loading="loading"
      :pagination="pagination"
      remote
      :scroll-x="getTableScrollX(columns)"
      :row-key="row => row.id"
      class="sm:h-full"
      :row-props="handleRowClick"
    />
    <DictTypeOperateDrawer
      v-model:visible="drawerVisible"
      :operate-type="operateType"
      :row-data="editingData"
      @submitted="getDataByPage"
    />
  </div>
</template>
