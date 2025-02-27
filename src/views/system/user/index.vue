<script setup lang="tsx">
import { NAvatar, NButton, NPopconfirm, NTag } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchGetUserList, fetchUpdatedUserStatus } from '@/service/api';
import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import { $t } from '@/locales';
import type { SearchFormType } from '@/components/advanced/search-form';
import { useAuth } from '@/hooks/business/auth';
import { generatePrefix } from '@/utils/common';
import UserOperateDrawer from './modules/user-operate-drawer.vue';
import DeptTree from './modules/dept-tree.vue';

const appStore = useAppStore();
const { hasAuth } = useAuth();

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
    key: 'nickName',
    label: '昵称',
    type: 'Input',
    props: {
      placeholder: '请输入昵称'
    }
  },
  {
    key: 'email',
    label: '邮箱',
    type: 'Input',
    props: {
      placeholder: '请输入邮箱'
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
          value: 1,
          label: $t('common.enable')
        },
        {
          value: 0,
          label: $t('common.disable')
        }
      ]
    }
  },
  {
    key: 'roleId',
    label: '角色',
    type: 'Select',
    props: {
      placeholder: '请选择角色',
      options: [
        {
          value: 1,
          label: '管理员'
        },
        {
          value: 2,
          label: '普通用户'
        }
      ]
    }
  }
];

const { columns, columnChecks, data, loading, pagination, getDataByPage, getData, searchParams, resetSearchParams } =
  useTable({
    apiFn: fetchGetUserList,
    showTotal: true,
    apiParams: {
      currentPage: 1,
      pageSize: 10,
      // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
      // the value can not be undefined, otherwise the property in Form will not be reactive
      status: null,
      username: null,
      gender: null,
      nickName: null,
      phone: null,
      email: null,
      deptId: null,
      roleId: null
    },
    columns: () => [
      {
        fixed: 'left',
        type: 'selection',
        align: 'center',
        width: 48
      },
      {
        key: 'index',
        title: $t('common.index'),
        align: 'center',
        width: 64,
        tree: true
      },
      {
        key: 'username',
        title: $t('page.manage.user.username'),
        align: 'center',
        minWidth: 100
      },

      {
        key: 'avatar',
        title: '头像', // $t('page.manage.user.userGender'),
        align: 'center',
        width: 60,
        render: row => {
          if (row.avatar === null) {
            return null;
          }

          return <NAvatar src={row.avatar as string} round size="medium"></NAvatar>;
        }
      },
      {
        key: 'nickName',
        title: $t('page.manage.user.nickName'),
        align: 'center',
        minWidth: 100
      },
      {
        key: 'dept',
        title: '部门', // $t('page.manage.user.role'),
        align: 'center',
        minWidth: 100,
        render: row => {
          if (row.dept === null) return null;
          return <NTag>{row.dept.name}</NTag>;
        }
      },
      {
        key: 'roles',
        title: '角色', // $t('page.manage.user.role'),
        align: 'center',
        minWidth: 100,
        render: row => {
          if (row.roles.length === 0) return null;
          const roleMap: Record<any, NaiveUI.ThemeColor> = {
            admin: 'primary'
          };
          return row.roles.map(role => <NTag type={roleMap[role.value] || 'success'}>{role.name}</NTag>);
        }
      },
      {
        key: 'gender',
        title: $t('page.manage.user.userGender'),
        align: 'center',
        width: 60,
        render: row => {
          if (row.gender === null) {
            return null;
          }

          const tagMap: Record<Api.SystemManage.UserGender, NaiveUI.ThemeColor> = {
            1: 'primary',
            0: 'error'
          };

          const label = $t(userGenderRecord[row.gender]);

          return <NTag type={tagMap[row.gender]}>{label}</NTag>;
        }
      },
      {
        key: 'phone',
        title: $t('page.manage.user.phone'),
        align: 'center',
        width: 120
      },
      {
        key: 'email',
        title: $t('page.manage.user.email'),
        align: 'center',
        minWidth: 200
      },
      {
        key: 'status',
        title: $t('page.manage.user.status'),
        align: 'center',
        width: 100,
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
        fixed: 'right',
        key: 'operate',
        title: $t('common.operate'),
        align: 'center',
        width: 130,
        render: row => (
          <div class="flex-center gap-8px">
            <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
              {$t('common.edit')}
            </NButton>
            <NPopconfirm onPositiveClick={() => handleChangeStatus(row.id, row.status)}>
              {{
                default: () =>
                  $t(row.status ? 'page.manage.common.status.disable' : 'page.manage.common.status.enable'),
                trigger: () => (
                  <NButton type={row.status ? 'error' : 'success'} ghost size="small">
                    {$t(row.status ? 'page.manage.common.status.disable' : 'page.manage.common.status.enable')}
                  </NButton>
                )
              }}
            </NPopconfirm>
          </div>
        )
      }
    ]
  });

const { drawerVisible, checkedRowKeys, operateType, editingData, handleAdd, handleEdit } = useTableOperate(
  data,
  getData
);

function edit(id: string) {
  handleEdit(id);
}

async function handleChangeStatus(id: string, status: number | null) {
  const { error } = await fetchUpdatedUserStatus({
    ids: [id],
    status: status ? 0 : 1
  });
  if (!error) {
    window.$message?.success('操作成功');
  }
  // request
  getDataByPage();
}

async function handleBatchDChangeStatus() {
  const { error } = await fetchUpdatedUserStatus({
    ids: checkedRowKeys.value,
    status: 0
  });
  if (!error) {
    window.$message?.success('操作成功');
  }
  // request
  getDataByPage();
}

function selectDept(deptId: string) {
  if (searchParams.deptId && searchParams.deptId === deptId) return;
  searchParams.deptId = deptId;
  getDataByPage();
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <NSplit class="h-full" direction="horizontal" :default-size="0.2" :max="0.9" :min="0.1">
        <template #1>
          <DeptTree @select="selectDept" />
        </template>
        <template #2>
          <div class="h-full flex-col-stretch">
            <SearchForm
              v-model:model="searchParams"
              :fields="userSearchForm"
              @search="getDataByPage"
              @reset="resetSearchParams"
            />
            <TableHeaderOperation
              v-model:columns="columnChecks"
              prefix="system:user"
              :hide-delete="true"
              :hide-add="true"
              :disabled-delete="checkedRowKeys.length === 0"
              :loading="loading"
              @add="handleAdd"
              @refresh="getData"
            >
              <NPopconfirm
                v-if="hasAuth(generatePrefix('system:user', 'update'))"
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
              :row-key="row => row.id"
              class="sm:h-full"
            />
          </div>
        </template>
      </NSplit>
    </NCard>
    <UserOperateDrawer
      v-model:visible="drawerVisible"
      :operate-type="operateType"
      :row-data="editingData"
      @submitted="getDataByPage"
    />
  </div>
</template>

<style scoped></style>
