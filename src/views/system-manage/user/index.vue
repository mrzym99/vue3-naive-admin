<script setup lang="tsx">
import { NAvatar, NButton, NPopconfirm, NTag } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';
import { useTable } from '@/hooks/common/table';
import { fetchGetUserList } from '@/service/api';
import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import { $t } from '@/locales';

const appStore = useAppStore();

const edit = (id: string) => {
  console.log(id);
};

const handleDelete = (id: string) => {
  // request
  console.log(id);
};

const userSearchForm: Form.SearchForm = [
  {
    key: 'username',
    label: '用户名',
    type: 'input',
    placeholder: '请输入用户名',
    options: []
  },
  {
    key: 'username',
    label: '用户名',
    type: 'input',
    placeholder: '请输入用户名',
    options: []
  },
  {
    key: 'username',
    label: '用户名',
    type: 'input',
    placeholder: '请输入用户名',
    options: []
  },
  {
    key: 'username',
    label: '用户名',
    type: 'input',
    placeholder: '请输入用户名',
    options: []
  }
];

const { columns, data, loading } = useTable({
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

const handleSearch = (val: any) => {
  console.log(val);
};
const handleReset = () => {};
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <SearchForm :fields="userSearchForm" @search="handleSearch" @reset="handleReset" />
      <NDataTable
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="false"
        :virtual-scroll="true"
        class="sm:h-full"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
