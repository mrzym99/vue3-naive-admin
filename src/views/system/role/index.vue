<script setup lang="tsx">
import { NButton, NPopconfirm, NTag, NTime } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchDeleteRole, fetchGetRoleInfo, fetchGetRoleList, fetchSetRoleDefault } from '@/service/api';
import { $t } from '@/locales';
import type { SearchFormType } from '@/components/advanced/search-form';
import { enableStatusRecord } from '@/constants/business';
import RoleOperateDrawer from './modules/role-operate-drawer.vue';

const appStore = useAppStore();

const roleSearchForm: SearchFormType = [
  {
    key: 'name',
    label: '角色名称',
    type: 'Input',
    props: {
      placeholder: '请输入角色名称'
    }
  },
  {
    key: 'value',
    label: '角色值',
    type: 'Input',
    props: {
      placeholder: '请输入角色值'
    }
  },
  {
    key: 'status',
    label: '状态',
    type: 'Select',
    props: {
      placeholder: '请选择状态',
      options: [
        {
          label: $t('common.enable'),
          value: 1
        },
        {
          label: $t('common.disable'),
          value: 0
        }
      ]
    }
  }
];

const {
  columns,
  columnChecks,
  data,
  loading,
  getDataByPage,
  getData,
  searchParams,
  resetSearchParams,
  setExpand,
  setFold
} = useTable({
  apiFn: fetchGetRoleList,
  showTotal: true,
  apiParams: {
    currentPage: 1,
    pageSize: 10,
    name: '',
    value: '',
    status: null
  },
  columns: () => [
    {
      key: 'name',
      title: '角色名称', // $t('page.manage.role.role'),
      align: 'center',
      width: 200
    },
    {
      key: 'value',
      title: '角色值', // $t('page.manage.role.role'),
      width: 120,
      align: 'center'
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

        const label = $t(enableStatusRecord[row.status]);

        return <NTag type={tagMap[row.status]}>{label}</NTag>;
      }
    },
    {
      key: 'default',
      title: '默认角色',
      align: 'center',
      width: 80,
      render: row => {
        if (!row.default) {
          return null;
        }

        return <NTag type={'primary'}>是</NTag>;
      }
    },
    {
      key: 'description',
      title: '描述', // $t('page.manage.role.role'),
      width: 200,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'createdAt',
      title: '创建时间',
      width: 180,
      render: row => {
        return <NTime time={new Date(row.createdAt)} />;
      }
    },
    {
      key: 'updatedAt',
      title: '更新时间',
      width: 180,
      render: row => {
        return <NTime time={new Date(row.updatedAt)} />;
      }
    },
    {
      fixed: 'right',
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 220,
      render: row => (
        <div class="flex justify-items-start gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" ghost size="small">
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
          {row.default ? (
            ''
          ) : (
            <NPopconfirm onPositiveClick={() => handleSetDefault(row.id)}>
              {{
                default: () => '设置为默认',
                trigger: () => (
                  <NButton type={'tertiary'} ghost size="small">
                    设为默认
                  </NButton>
                )
              }}
            </NPopconfirm>
          )}
        </div>
      )
    }
  ]
});

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, onDeleted } = useTableOperate(data, getData);

async function edit(id: string) {
  const { error, data: roleInfo } = await fetchGetRoleInfo(id);
  if (error) {
    return;
  }
  handleEdit(id, roleInfo as any);
}

async function handleDelete(id: string) {
  const { error } = await fetchDeleteRole(id);
  if (!error) {
    onDeleted();
  }
}

async function handleSetDefault(id: string) {
  const { error } = await fetchSetRoleDefault(id);
  if (!error) {
    window.$message?.success('设置成功');
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
          :fields="roleSearchForm"
          @search="getDataByPage"
          @reset="resetSearchParams"
        />
        <TableHeaderOperation
          v-model:columns="columnChecks"
          prefix="system:role"
          :hide-delete="true"
          :loading="loading"
          @add="handleAdd"
          @refresh="getData"
          @expand="setExpand"
          @fold="setFold"
        />
        <NDataTable
          :columns="columns"
          :data="data"
          size="small"
          :flex-height="!appStore.isMobile"
          :loading="loading"
          remote
          :row-key="row => row.id"
          class="sm:h-full"
        />
      </div>
    </NCard>
    <RoleOperateDrawer
      v-model:visible="drawerVisible"
      :operate-type="operateType"
      :row-data="editingData"
      @submitted="getDataByPage"
    />
  </div>
</template>

<style scoped></style>
