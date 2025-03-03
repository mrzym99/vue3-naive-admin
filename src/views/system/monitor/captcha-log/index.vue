<script setup lang="tsx">
import { NTag, NTime } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';
import { useTable } from '@/hooks/common/table';
import type { SearchFormType } from '@/components/advanced/search-form';
import { fetchGetCaptchaLogList } from '@/service/api';
import { ProviderRecord, providerOptions } from '@/constants/business';
import { ProviderEnum } from '@/constants/enum';
import { $t } from '@/locales';

const appStore = useAppStore();

const userSearchForm: SearchFormType<Api.SystemManage.CaptchaLogSearchParams> = [
  {
    key: 'provider',
    label: '验证码提供商',
    type: 'Select',
    span: 8,
    props: {
      placeholder: '请选择服务验证码提供商',
      options: providerOptions
    }
  },
  {
    key: 'account',
    label: '账户',
    type: 'Input',
    props: {
      placeholder: '请输入账户'
    }
  }
];

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
        key: 'code',
        title: '验证码',
        align: 'center',
        width: 120
      },
      {
        key: 'provider',
        title: '验证码提供商', // $t('page.manage.user.userGender'),
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
        title: '发送时间',
        width: 200,
        render: row => {
          if (row.createdAt === null) return null;
          return <NTime time={new Date(row.createdAt)} />;
        }
      },
      {
        key: 'account',
        title: '账户',
        align: 'left',

        width: 150
      }
    ]
  });
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
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
          :hide-delete="true"
          :hide-add="true"
          :loading="loading"
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
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>
