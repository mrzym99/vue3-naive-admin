<script setup lang="tsx">
import { NTag, NTime } from 'naive-ui';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchBatchDeleteCaptchaLog, fetchGetCaptchaLogList } from '@/service/api';
import { ProviderRecord } from '@/constants/business';
import { ProviderEnum } from '@/constants/enum';
import { $t } from '@/locales';
import { useSearchForm } from '@/hooks/common/search-form';

const userSearchForm = useSearchForm<Api.SystemManage.CaptchaLogSearchParams>(() => [
  {
    key: 'provider',
    label: $t('page.manage.captchaLog.provider'),
    type: 'Select',
    span: 8,
    props: {
      placeholder: $t('common.pleaseSelect') + $t('page.manage.captchaLog.provider'),
      options: [
        {
          label: $t(ProviderRecord.captcha),
          value: ProviderEnum.CAPTCHA
        },
        {
          label: $t(ProviderRecord.email),
          value: ProviderEnum.EMAIL
        },
        {
          label: $t(ProviderRecord.sms),
          value: ProviderEnum.SMS
        }
      ]
    }
  },
  {
    key: 'account',
    label: $t('page.manage.captchaLog.account'),
    type: 'Input',
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.captchaLog.account')
    }
  }
]);

const { columns, columnChecks, data, loading, pagination, getDataByPage, getData, searchParams, resetSearchParams } =
  useTable({
    apiFn: fetchGetCaptchaLogList,
    showTotal: true,
    apiParams: {
      currentPage: 1,
      pageSize: 10,
      // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
      // the value can not be undefined, otherwise the property in Form will not be reactive
      account: '',
      provider: null
    },
    columns: () => [
      {
        type: 'selection',
        width: 48
      },
      {
        key: 'code',
        title: $t('page.manage.captchaLog.captcha'),
        align: 'left',
        width: 100
      },
      {
        key: 'provider',
        title: $t('page.manage.captchaLog.provider'),
        align: 'center',
        width: 200,
        render: row => {
          if (row.provider === null) return null;

          const tagMap: Record<Api.SystemManage.Provider, NaiveUI.ThemeColor> = {
            [ProviderEnum.CAPTCHA]: 'primary',
            [ProviderEnum.SMS]: 'info',
            [ProviderEnum.EMAIL]: 'warning'
          };

          const label = $t(ProviderRecord[row.provider]);
          return <NTag type={tagMap[row.provider]}>{label}</NTag>;
        }
      },
      {
        key: 'createdAt',
        title: $t('common.createdAt'),
        width: 200,
        render: row => {
          if (row.createdAt === null) return null;
          return <NTime time={new Date(row.createdAt)} />;
        }
      },
      {
        key: 'account',
        title: $t('page.manage.captchaLog.account'),
        width: 150
      }
    ]
  });
const { checkedRowKeys, onBatchDeleted } = useTableOperate(data, getData);

async function batchDelete() {
  const { error } = await fetchBatchDeleteCaptchaLog(checkedRowKeys.value as string[]);
  if (!error) {
    onBatchDeleted();
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden">
    <NCard :bordered="false" size="small" class="flex-1 card-wrapper">
      <div class="h-full flex-col-stretch">
        <SearchForm
          v-model:model="searchParams"
          :label-width="100"
          :fields="userSearchForm"
          @search="getDataByPage"
          @reset="resetSearchParams"
        />
        <TableHeaderOperation
          v-model:columns="columnChecks"
          prefix="system:captcha-log"
          :hide-add="true"
          :loading="loading"
          :disabled-delete="checkedRowKeys.length === 0"
          @refresh="getData"
          @delete="batchDelete"
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
