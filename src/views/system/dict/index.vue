<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { ref } from 'vue';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t, getLocale } from '@/locales';
import { useAuth } from '@/hooks/business/auth';
import { generatePrefix, getTableScrollX } from '@/utils/common';
import { useSearchForm } from '@/hooks/common/search-form';
import { fetchBatchUpdateDictItemStatus, fetchDeleteDictItem, fetchGetDictItemList } from '@/service/api';
import { StatusEnum } from '@/constants/enum';
import { useAppStore } from '@/store/modules/app';
import DictItemOperateDrawer from './modules/dict-item-operate-drawer.vue';
import DictTypeList from './modules/dict-type-list.vue';

const { hasAuth } = useAuth();
const appStore = useAppStore();

const dictItemSearchForm = useSearchForm<Api.SystemManage.DictItemSearchParams>(() => [
  {
    key: 'label',
    label: $t('page.manage.dict.label'),
    type: 'Input',
    span: appStore.isMobile ? 24 : 8,
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.dict.label')
    }
  },
  {
    key: 'value',
    label: $t('page.manage.dict.value'),
    type: 'Input',
    span: appStore.isMobile ? 24 : 8,
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.dict.value')
    }
  }
]);
const currentDictType = ref<Api.SystemManage.DictType>();

const {
  columns,
  columnChecks,
  data,
  loading,
  pagination,
  getDataByPage,
  getData,
  searchParams,
  resetSearchParams,
  updateSearchParams
} = useTable({
  apiFn: fetchGetDictItemList,
  showTotal: true,
  apiParams: {
    currentPage: 1,
    pageSize: 10,
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    label: '',
    value: '',
    typeId: null
  },
  immediate: false,
  columns: () => [
    {
      fixed: 'left',
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      fixed: 'left',
      key: 'label',
      title: $t('page.manage.dict.label'),
      align: 'center',
      width: 80,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'value',
      title: $t('page.manage.dict.value'),
      align: 'center',
      width: 80,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'order',
      title: $t('page.manage.common.order'),
      align: 'center',
      width: 80
    },
    {
      key: 'remark',
      title: $t('page.manage.common.remark'),
      align: 'center',
      width: 150,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'status',
      title: $t('common.status'),
      width: 100,
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
      width: getLocale.value === 'zh-CN' ? 120 : 200,
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
              default: () => `${$t('common.delete')} - ${row.label} ？`,
              trigger: () => (
                <NButton disabled={!hasAuth('system:dict-item:delete')} type={'error'} ghost size="small">
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

const beforeResetSearchParams = () => {
  resetSearchParams();
  updateSearchParams({
    typeId: currentDictType.value?.id
  });
};

const { drawerVisible, checkedRowKeys, operateType, editingData, handleAdd, handleEdit, onBatchDeleted } =
  useTableOperate(data, getData);

function edit(id: number) {
  handleEdit(id);
}

async function handleDelete(id: number) {
  const { error } = await fetchDeleteDictItem([id]);
  if (!error) {
    onBatchDeleted();
  }
}

async function batchDelete() {
  const { error } = await fetchDeleteDictItem(checkedRowKeys.value as number[]);
  if (!error) {
    onBatchDeleted();
  }
}

async function handleBatchDChangeStatus() {
  const { error } = await fetchBatchUpdateDictItemStatus({
    ids: checkedRowKeys.value as number[],
    status: 0
  });
  if (!error) {
    window.$message?.success($t('common.operateSuccess'));
  }
  // request
  getDataByPage();
}

function handleChangeDictType(item: Api.SystemManage.DictType) {
  if (!item || !item.id) return;
  searchParams.typeId = item.id;
  currentDictType.value = item;
  getDataByPage();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <NSplit v-if="!appStore.isMobile" class="h-full" direction="horizontal" :default-size="0.4" :max="0.7" :min="0.3">
        <template #1>
          <DictTypeList @change="handleChangeDictType" />
        </template>
        <template #2>
          <div class="h-full flex-col-stretch px-10px">
            <div class="mb-1 flex items-center">
              <h3 class="mr-2 font-bold">{{ $t('page.manage.dict.dictItem.currentTypeName') }} :</h3>
              {{ currentDictType?.name }}
            </div>
            <SearchForm
              v-model:model="searchParams"
              :fields="dictItemSearchForm"
              @search="getDataByPage"
              @reset="beforeResetSearchParams"
            />
            <TableHeaderOperation
              v-model:columns="columnChecks"
              prefix="system:user"
              :disabled-delete="checkedRowKeys.length === 0"
              :loading="loading"
              @delete="batchDelete"
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
              :scroll-x="getTableScrollX(columns)"
              remote
              :row-key="row => row.id"
              class="sm:h-full"
            />
          </div>
        </template>
      </NSplit>
      <NGrid v-else :y-gap="16">
        <NGridItem :span="24">
          <DictTypeList @change="handleChangeDictType" />
        </NGridItem>
        <NGridItem :span="24">
          <div class="h-full flex-col-stretch px-10px lt-sm:h-70vh">
            <div class="flex items-center">
              <h3 class="font-bold">当前类型名称：</h3>
              {{ currentDictType?.name }}
            </div>
            <SearchForm
              v-model:model="searchParams"
              :fields="dictItemSearchForm"
              @search="getDataByPage"
              @reset="beforeResetSearchParams"
            />
            <TableHeaderOperation
              v-model:columns="columnChecks"
              prefix="system:user"
              :disabled-delete="checkedRowKeys.length === 0"
              :loading="loading"
              @delete="batchDelete"
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
              :scroll-x="getTableScrollX(columns)"
              remote
              :row-key="row => row.id"
              class="sm:h-full"
            />
          </div>
        </NGridItem>
      </NGrid>
      <DictItemOperateDrawer
        v-model:visible="drawerVisible"
        :type-id="currentDictType?.id"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
