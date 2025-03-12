<script setup lang="tsx">
import { NButton, NPopconfirm, NTag, NTime } from 'naive-ui';
import { onMounted } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { useSSEStore } from '@/store/modules/sse';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchGetOnlineUserList, fetchKickOnlineUser } from '@/service/api';
import { $t } from '@/locales';
import type { SearchFormType } from '@/components/advanced/search-form';
import { useAuth } from '@/hooks/business/auth';

const appStore = useAppStore();
const sseStore = useSSEStore();
const { hasAuth } = useAuth();

const userSearchForm: SearchFormType<Api.SystemManage.OnlineUserSearchParams> = [
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
  }
];

const { columns, columnChecks, data, loading, pagination, getDataByPage, getData, searchParams, resetSearchParams } =
  useTable({
    apiFn: fetchGetOnlineUserList,
    showTotal: true,
    apiParams: {
      currentPage: 1,
      pageSize: 10,
      // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
      // the value can not be undefined, otherwise the property in Form will not be reactive
      username: null,
      nickName: null
    },
    columns: () => [
      {
        key: 'tokenId',
        title: '会话编号',
        align: 'left',
        width: 300,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'username',
        title: $t('page.manage.user.username'),
        align: 'center',
        width: 150,
        render: row => {
          if (row.username === null) return null;

          if (row.isCurrentUser) {
            return (
              <div>
                {row.username}
                <NTag type="success">Me</NTag>{' '}
              </div>
            );
          }

          return row.username;
        }
      },
      {
        key: 'nickName',
        title: '昵称',
        align: 'center',
        minWidth: 100
      },
      {
        key: 'deptName',
        title: '部门名称', // $t('page.manage.user.userGender'),
        align: 'center',
        width: 100,
        render: row => {
          if (row.deptName === null) return null;
          return <NTag>{row.deptName}</NTag>;
        }
      },
      {
        key: 'ip',
        title: '登录ip',
        align: 'center',
        width: 150
      },
      {
        key: 'address',
        title: '登录地址', // $t('page.manage.user.role'),
        align: 'center',
        minWidth: 100
      },
      {
        key: 'browser',
        title: '浏览器', // $t('page.manage.user.role'),
        align: 'center',
        minWidth: 100
      },
      {
        key: 'os',
        title: '操作系统',
        align: 'center',
        width: 120
      },
      {
        key: 'time',
        title: '登录时间',
        width: 200,
        render: row => {
          return <NTime time={new Date(row.time)} />;
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
            <NPopconfirm onPositiveClick={() => handleKick(row.tokenId)}>
              {{
                default: () => `下线用户 - ${row.username} ？`,
                trigger: () => (
                  <NButton disabled={!hasAuth('system:online:kick')} type={'error'} ghost size="small">
                    {'下线'}
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

async function handleKick(tokenId: string) {
  const { error } = await fetchKickOnlineUser({
    tokenId
  });
  if (!error) {
    window.$message?.success('操作成功');
    getDataByPage();
  }
}

onMounted(async () => {
  sseStore.emitter.on('onlineUser', () => {
    getDataByPage();
  });
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <div class="h-full flex-col-stretch">
        <SearchForm
          v-model:model="searchParams"
          :fields="userSearchForm"
          @search="getDataByPage"
          @reset="resetSearchParams"
        />
        <TableHeaderOperation
          v-model:columns="columnChecks"
          prefix="system:online"
          :hide-delete="true"
          :hide-add="true"
          :loading="loading"
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
