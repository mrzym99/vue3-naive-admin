<script setup lang="tsx">
import { NButton, NPopconfirm, NTag, NTime } from 'naive-ui';
import { onMounted } from 'vue';
import { useSSEStore } from '@/store/modules/sse';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchGetOnlineUserList, fetchKickOnlineUser } from '@/service/api';
import { $t } from '@/locales';
import { useAuth } from '@/hooks/business/auth';
import { useSearchForm } from '@/hooks/common/search-form';
import { getTableScrollX } from '@/utils/common';
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore();
const sseStore = useSSEStore();
const { hasAuth } = useAuth();

const userSearchForm = useSearchForm<Api.SystemManage.OnlineUserSearchParams>(() => [
  {
    key: 'username',
    label: $t('page.manage.user.username'),
    type: 'Input',
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.user.username')
    }
  },
  {
    key: 'nickName',
    label: $t('page.manage.user.nickName'),
    type: 'Input',
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.user.nickName')
    }
  }
]);

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
        title: $t('page.manage.online.sessionId'),
        align: 'left',
        width: 150,
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
        title: $t('page.manage.user.nickName'),
        align: 'center',
        width: 100,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'deptName',
        title: $t('page.manage.user.dept'),
        align: 'center',
        width: 100,
        render: row => {
          if (row.deptName === null) return null;
          return <NTag>{row.deptName}</NTag>;
        }
      },
      {
        key: 'ip',
        title: $t('page.manage.online.ip'),
        align: 'center',
        width: 200,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'address',
        title: $t('page.manage.online.address'),
        align: 'center',
        width: 150
      },
      {
        key: 'browser',
        title: $t('page.manage.online.browser'),
        align: 'center',
        width: 120
      },
      {
        key: 'os',
        title: $t('page.manage.online.os'),
        align: 'center',
        width: 120
      },
      {
        key: 'time',
        title: $t('page.manage.online.loginTime'),
        width: 200,
        render: row => {
          return <NTime time={new Date(row.time)} />;
        }
      },
      {
        key: 'operate',
        title: $t('common.operate'),
        align: 'center',
        width: 130,
        render: row => (
          <div class="flex-center gap-8px">
            <NPopconfirm onPositiveClick={() => handleKick(row.tokenId)}>
              {{
                default: () => `${$t('page.manage.online.offline')} - ${row.username} ？`,
                trigger: () => (
                  <NButton disabled={!hasAuth('system:online:kick') || row.disabled} type={'error'} ghost size="small">
                    {$t('page.manage.online.offline')}
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
    window.$message?.success($t('common.operateSuccess'));
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
          :scroll-x="getTableScrollX(columns)"
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
