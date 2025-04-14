<script setup lang="tsx">
import { NButton, NPopconfirm, NTag, NTime } from 'naive-ui';
import { useRouter } from 'vue-router';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { fetchDeleteNotice, fetchGetNoticeList } from '@/service/api';
import { $t } from '@/locales';
import { useAuth } from '@/hooks/business/auth';
import { useSearchForm } from '@/hooks/common/search-form';
import { enableStatusRecord } from '@/constants/business';
import { useDicts } from '@/hooks/common/dict';
import { useDetailDescriptions } from '@/hooks/common/detail-descriptions';
import { StatusEnum } from '@/constants/enum';
import DetailsDescriptions from '@/components/advanced/details-descriptions/details-descriptions.vue';
import TinymcePreview from '@/components/common/tinymce/tinymce-preview.vue';

const { hasAuth } = useAuth();
const { getDictNameByValue } = useDicts(['notice_type']);
const router = useRouter();

const noticeSearchForm = useSearchForm<Api.SystemManage.NoticeSearchParams>(() => [
  {
    key: 'name',
    label: $t('page.manage.notice.name'),
    type: 'Input',
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.notice.name')
    }
  }
]);

const detailColumns = useDetailDescriptions<Api.SystemManage.Notice>(() => [
  {
    key: 'name',
    label: $t('page.manage.notice.name'),
    span: 1
  },
  {
    key: 'type',
    label: $t('page.manage.notice.type'),
    span: 1,
    render: row => {
      if (row.type === null) {
        return null;
      }
      return <NTag type={row.type === 1 ? 'primary' : 'warning'}>{getDictNameByValue('notice_type', row.type)}</NTag>;
    }
  },
  {
    key: 'status',
    label: $t('common.status'),
    span: 1,
    render: row => {
      return (
        <NTag type={row.status === StatusEnum.ENABLE ? 'success' : 'error'}>
          {row.status === StatusEnum.ENABLE ? $t('common.enable') : $t('common.disable')}
        </NTag>
      );
    }
  },
  {
    key: 'content',
    label: $t('page.manage.notice.content'),
    span: 3,
    render: row => {
      return <TinymcePreview class="min-h-50vh" content={row.content} />;
    }
  }
]);

const { columns, columnChecks, data, loading, pagination, getDataByPage, getData, searchParams, resetSearchParams } =
  useTable({
    apiFn: fetchGetNoticeList,
    showTotal: true,
    apiParams: {
      currentPage: 1,
      pageSize: 10,
      name: ''
    },
    columns: () => [
      {
        fixed: 'left',
        key: 'name',
        title: $t('page.manage.notice.name'),
        align: 'left',
        width: 150,
        render: row => {
          return (
            <span class={'detail-link'} onClick={() => detail(row.id)}>
              {row.name}
            </span>
          );
        }
      },
      {
        key: 'type',
        title: $t('page.manage.notice.type'),
        width: 180,
        render: row => {
          if (row.type === null) {
            return null;
          }

          return <NTag>{getDictNameByValue('notice_type', row.type)}</NTag>;
        }
      },
      {
        key: 'status',
        title: $t('common.status'),
        width: 80,
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
        key: 'createdAt',
        title: $t('common.createdAt'),
        width: 180,
        render: row => {
          return <NTime time={new Date(row.createdAt)} />;
        }
      },
      {
        key: 'operate',
        title: $t('common.operate'),
        align: 'center',
        width: 120,
        render: row => (
          <div class="flex justify-items-start gap-8px">
            <NButton
              disabled={!hasAuth('system:notice:update')}
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
                  <NButton disabled={!hasAuth('system:notice:delete')} type="error" ghost size="small">
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

const { onDeleted, modelVisible, detailData, handleDetail } = useTableOperate(data, getData);

async function edit(id: number) {
  router.push({
    path: '/system/notice/notice-operate',
    query: {
      id
    }
  });
}

function add() {
  router.push({
    path: '/system/notice/notice-operate'
  });
}

async function handleDelete(id: number) {
  const { error } = await fetchDeleteNotice(id);
  if (!error) {
    onDeleted();
  }
}

async function detail(id: number) {
  if (hasAuth('system:notice:read')) {
    handleDetail(id);
  } else {
    window.$message?.error($t('common.noPermission'));
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden">
    <NCard :bordered="false" size="small" class="flex-1 card-wrapper">
      <div class="h-full flex-col-stretch">
        <SearchForm
          v-model:model="searchParams"
          :fields="noticeSearchForm"
          @search="getDataByPage"
          @reset="resetSearchParams"
        />
        <TableHeaderOperation
          v-model:columns="columnChecks"
          prefix="system:notice"
          :hide-delete="true"
          :loading="loading"
          @add="add"
          @refresh="getData"
        />
        <NDataTable
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
    <DetailsDescriptions
      v-model:visible="modelVisible"
      :title="$t('page.manage.notice.detail')"
      width="60%"
      :column="3"
      :label-style="{ width: '100px' }"
      :fields="detailColumns"
      :data="detailData"
    ></DetailsDescriptions>
  </div>
</template>

<style scoped lang="scss">
a {
  color: var(--soy-primary-color) !important;
  text-decoration: underline !important;
}
</style>
