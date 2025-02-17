<script setup lang="tsx">
import type { TreeOption } from 'naive-ui';
import { NAvatar, NButton, NPopconfirm, NTag } from 'naive-ui';
import { ref } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchGetUserList } from '@/service/api';
import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import { $t } from '@/locales';
import UserOperateDrawer from './modules/user-operate-drawer.vue';
import DeptTree from './modules/dept-tree.vue';

const appStore = useAppStore();

const userSearchForm: Form.SearchForm = [
  {
    key: 'username',
    label: '用户名',
    type: 'input',
    placeholder: '请输入用户名',
    options: []
  },
  {
    key: 'nickName',
    label: '昵称',
    type: 'input',
    placeholder: '请输入昵称',
    options: []
  },
  {
    key: 'gender',
    label: '性别',
    type: 'select',
    placeholder: '请选择性别',
    options: [
      {
        value: '0',
        label: '女'
      },
      {
        value: '1',
        label: '男'
      }
    ]
  },
  {
    key: 'roleId',
    label: '角色',
    type: 'select',
    placeholder: '请选择角色',
    options: [
      {
        value: '1',
        label: '管理员'
      },
      {
        value: '2',
        label: '普通用户'
      }
    ]
  }
];

const { columns, columnChecks, data, loading, pagination, getDataByPage, getData, searchParams, resetSearchParams } =
  useTable({
    apiFn: fetchGetUserList,
    showTotal: true,
    apiParams: {
      currentPage: 1,
      pageSize: 20,
      // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
      // the value can not be undefined, otherwise the property in Form will not be reactive
      status: null,
      username: null,
      gender: null,
      nickName: null,
      phone: null,
      email: null
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
        width: 64
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

          return <NAvatar src={row.avatar} round size="medium"></NAvatar>;
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
            0: 'warning'
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
          </div>
        )
      }
    ]
  });

const { drawerVisible, checkedRowKeys, operateType, editingData, handleAdd, handleEdit, onDeleted, onBatchDeleted } =
  useTableOperate(data, getData);

async function handleBatchDelete() {
  // request
  console.log(checkedRowKeys.value);

  onBatchDeleted();
}

function edit(id: string) {
  handleEdit(id);
}

function handleDelete(id: string) {
  console.log(id);
  // request
  onDeleted();
}

// dept 相关
const deptTree = ref<TreeOption[]>([
  {
    key: '1',
    label: '国内',
    children: [
      {
        key: '2',
        label: '四川'
      }
    ]
  },
  {
    key: '6',
    label: '国外',
    children: [
      {
        key: '7',
        label: '美国',
        children: [
          {
            key: '8',
            label: '纽约'
          }
        ]
      }
    ]
  }
]);
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <NGrid x-gap="12" class="h-full">
        <NGi span="6">
          <DeptTree :row-data="deptTree" :default-expanded-keys="deptTree.map(d => d.key as string)" />
        </NGi>
        <NGi span="18" class="flex-col-stretch">
          <SearchForm
            v-model:model="searchParams"
            :fields="userSearchForm"
            @search="getDataByPage"
            @reset="resetSearchParams"
          />
          <TableHeaderOperation
            v-model:columns="columnChecks"
            prefix="system:user"
            :disabled-delete="checkedRowKeys.length === 0"
            :loading="loading"
            @add="handleAdd"
            @delete="handleBatchDelete"
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
        </NGi>
      </NGrid>
      <UserOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
