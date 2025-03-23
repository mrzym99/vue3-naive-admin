<script setup lang="tsx">
import { NButton, NPopconfirm, NTag, NTime } from 'naive-ui';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchDeleteRole, fetchGetRoleInfo, fetchGetRoleList, fetchSetRoleDefault } from '@/service/api';
import { $t } from '@/locales';
import { enableStatusRecord } from '@/constants/business';
import { useAuth } from '@/hooks/business/auth';
import { useSearchForm } from '@/hooks/common/search-form';
import { useDetailDescriptions } from '@/hooks/common/detail-descriptions';
import { StatusEnum } from '@/constants/enum';
import RoleOperateDrawer from './modules/role-operate-drawer.vue';

const { hasAuth } = useAuth();

const roleSearchForm = useSearchForm<Api.SystemManage.RoleSearchParams>(() => [
  {
    key: 'name',
    label: $t('page.manage.role.name'),
    type: 'Input',
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.role.name')
    }
  },
  {
    key: 'value',
    label: $t('page.manage.role.value'),
    type: 'Input',
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.role.value')
    }
  },
  {
    key: 'status',
    label: $t('common.status'),
    type: 'Select',
    props: {
      placeholder: $t('common.pleaseSelect') + $t('common.status'),
      options: [
        {
          label: $t('common.enable'),
          value: StatusEnum.ENABLE
        },
        {
          label: $t('common.disable'),
          value: StatusEnum.DISABLE
        }
      ]
    }
  }
]);

const { columns, columnChecks, data, loading, pagination, getDataByPage, getData, searchParams, resetSearchParams } =
  useTable({
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
        fixed: 'left',
        key: 'name',
        title: $t('page.manage.role.name'),
        align: 'left',
        width: 180,
        render: row => {
          return (
            <span class={'detail-link'} onClick={() => detail(row.id)}>
              {row.name}
            </span>
          );
        }
      },
      {
        key: 'value',
        title: $t('page.manage.role.value'),
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
        title: $t('page.manage.role.default'),
        align: 'center',
        width: 120,
        render: row => {
          if (!row.default) {
            return null;
          }

          return <NTag type={'primary'}>{$t('common.yesOrNo.yes')}</NTag>;
        }
      },
      {
        key: 'description',
        title: $t('page.manage.role.desc'),
        minWidth: 200,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'createdAt',
        title: $t('common.createdAt'),
        width: 180,
        render: row => {
          return <NTime time={new Date(row.createdAt)} />;
        }
      },
      {
        key: 'updatedAt',
        title: $t('common.updatedAt'),
        width: 180,
        render: row => {
          return <NTime time={new Date(row.updatedAt)} />;
        }
      },
      {
        key: 'operate',
        title: $t('common.operate'),
        align: 'center',
        width: 220,
        render: row => (
          <div class="flex justify-items-start gap-8px">
            <NButton
              disabled={!hasAuth('system:role:update')}
              type="primary"
              ghost
              size="small"
              onClick={() => edit(row.id)}
            >
              {$t('common.edit')}
            </NButton>
            <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
              {{
                default: () => $t('common.confirmDelete'),
                trigger: () => (
                  <NButton disabled={!hasAuth('system:role:delete')} type="error" ghost size="small">
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
                  default: () => $t('common.setDefault'),
                  trigger: () => (
                    <NButton disabled={!hasAuth('system:role:update')} type={'tertiary'} ghost size="small">
                      {$t('common.setDefault')}
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

const detailColumns = useDetailDescriptions<Partial<Api.SystemManage.Role>>(() => [
  {
    key: 'name',
    label: $t('page.manage.role.name')
  },
  {
    key: 'value',
    label: $t('page.manage.role.value')
  },
  {
    key: 'status',
    label: $t('common.status'),
    render: row => {
      return (
        <NTag type={row.status === StatusEnum.ENABLE ? 'success' : 'error'}>
          {row.status === StatusEnum.ENABLE ? $t('common.enable') : $t('common.disable')}
        </NTag>
      );
    }
  },
  {
    key: 'default',
    label: $t('page.manage.role.default'),
    render: row => {
      return (
        <NTag type={row.default ? 'success' : 'info'}>
          {row.default ? $t('common.yesOrNo.yes') : $t('common.yesOrNo.no')}
        </NTag>
      );
    }
  },
  {
    key: 'description',
    label: $t('page.manage.role.desc'),
    span: 2
  },
  {
    key: 'createdAt',
    label: $t('common.createdAt'),
    span: 2,
    render: row => {
      if (!row.createdAt) {
        return null;
      }
      return <NTime time={new Date(row.createdAt)} />;
    }
  },
  {
    key: 'updatedAt',
    label: $t('common.updatedAt'),
    span: 2,
    render: row => {
      if (!row.updatedAt) {
        return null;
      }
      return <NTime time={new Date(row.updatedAt)} />;
    }
  }
]);

const {
  drawerVisible,
  modelVisible,
  detailData,
  handleDetail,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  onDeleted
} = useTableOperate(data, getData);

async function detail(id: string) {
  if (hasAuth('system:role:read')) {
    handleDetail(id);
  } else {
    window.$message?.error($t('common.noPermission'));
  }
}

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
    window.$message?.success($t('common.setDefault') + $t('common.successOrFailRecord.success'));
    getDataByPage();
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :bordered="false" size="small" class="flex-1 card-wrapper">
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
        />
        <NDataTable
          :columns="columns"
          :data="data"
          size="small"
          :loading="loading"
          flex-height
          :pagination="pagination"
          remote
          :row-key="row => row.id"
          class="min-h-300px flex-1"
        />
      </div>
    </NCard>
    <RoleOperateDrawer
      v-model:visible="drawerVisible"
      :operate-type="operateType"
      :row-data="editingData"
      @submitted="getDataByPage"
    />
    <DetailsDescriptions
      v-model:visible="modelVisible"
      :title="$t('page.manage.role.detail')"
      width="60%"
      :fields="detailColumns"
      :data="detailData"
    />
  </div>
</template>

<style scoped></style>
