<script setup lang="tsx">
import { NButton, NPopconfirm, NTag, NTime } from 'naive-ui';
import { useTable, useTableOperate } from '@/hooks/common/table';
import {
  fetchDeleteTask,
  fetchGetTaskInfo,
  fetchGetTaskList,
  fetchOnceTask,
  fetchStartTask,
  fetchStopTask
} from '@/service/api';
import { $t } from '@/locales';
import { TaskTypeRecord, enableStatusRecord } from '@/constants/business';
import { useAuth } from '@/hooks/business/auth';
import { useSearchForm } from '@/hooks/common/search-form';
import { StatusEnum, TaskTypeEnum } from '@/constants/enum';
import { useDetailDescriptions } from '@/hooks/common/detail-descriptions';
import TaskOperateDrawer from './modules/task-operate-drawer.vue';

const { hasAuth } = useAuth();

const taskSearchForm = useSearchForm<Api.SystemManage.TaskSearchParams>(() => [
  {
    key: 'name',
    label: $t('page.manage.task.name'),
    type: 'Input',
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.task.name')
    }
  },
  {
    key: 'service',
    label: $t('page.manage.task.service'),
    type: 'Input',
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.task.service')
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

const {
  columns,
  columnChecks,
  data,
  loading,
  pagination,
  getDataByPage,
  getData,
  searchParams,
  resetSearchParams,
  scrollX
} = useTable({
  apiFn: fetchGetTaskList,
  showTotal: true,
  apiParams: {
    currentPage: 1,
    pageSize: 10,
    name: '',
    status: null,
    service: ''
  },
  columns: () => [
    {
      fixed: 'left',
      key: 'name',
      title: $t('page.manage.task.name'),
      align: 'left',
      width: 120,
      render: row => {
        return (
          <span class={'detail-link'} onClick={() => detail(row.id)}>
            {row.name}
          </span>
        );
      }
    },
    {
      key: 'status',
      title: $t('common.status'),
      align: 'center',
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
      key: 'type',
      title: $t('page.manage.task.taskType'),
      align: 'center',
      width: 80,
      render: row => {
        const taskMap: Record<Api.SystemManage.TaskType, NaiveUI.ThemeColor> = {
          0: 'success',
          1: 'primary'
        };

        const label = $t(TaskTypeRecord[row.type]);

        return <NTag type={taskMap[row.type]}>{label}</NTag>;
      }
    },
    {
      key: 'service',
      title: $t('page.manage.task.service'), // $t('page.manage.task.task'),
      width: 200,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'data',
      title: $t('page.manage.task.params'),
      width: 260,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'remark',
      title: $t('page.manage.common.remark'),
      width: 240,
      ellipsis: {
        tooltip: true
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 260,
      render: row => (
        <div class="flex justify-items-start gap-8px">
          <NButton
            disabled={!hasAuth('system:task:update')}
            type="primary"
            ghost
            size="small"
            onClick={() => edit(row.id)}
          >
            {$t('common.edit')}
          </NButton>

          {!row.status ? (
            <NPopconfirm onPositiveClick={() => handleStart(row.id)}>
              {{
                default: () => `${$t('page.manage.task.start')}?`,
                trigger: () => (
                  <NButton disabled={!hasAuth('system:task:start')} type="primary" ghost size="small">
                    {$t('page.manage.task.start')}
                  </NButton>
                )
              }}
            </NPopconfirm>
          ) : (
            ''
          )}
          <NPopconfirm onPositiveClick={() => handleOnce(row.id)}>
            {{
              default: () => `${$t('page.manage.task.once')}?`,
              trigger: () => (
                <NButton disabled={!hasAuth('system:task:once')} type="primary" ghost size="small">
                  {$t('page.manage.task.once')}
                </NButton>
              )
            }}
          </NPopconfirm>
          {row.status ? (
            <NPopconfirm onPositiveClick={() => handleStop(row.id)}>
              {{
                default: () => `${$t('page.manage.task.stop')}?`,
                trigger: () => (
                  <NButton disabled={!hasAuth('system:task:stop')} type="error" ghost size="small">
                    {$t('page.manage.task.stop')}
                  </NButton>
                )
              }}
            </NPopconfirm>
          ) : (
            ''
          )}
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton disabled={!hasAuth('system:task:delete')} type="error" ghost size="small">
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

const detailColumns = useDetailDescriptions<Api.SystemManage.Task>(() => [
  {
    key: 'name',
    label: $t('page.manage.task.name')
  },
  {
    key: 'type',
    label: $t('page.manage.task.taskType'),
    render: row => {
      return (
        <NTag type={row.type === 0 ? 'success' : 'primary'}>
          {row.type === TaskTypeEnum.CRON ? $t('page.manage.task.cron') : $t('page.manage.task.interval')}
        </NTag>
      );
    }
  },
  {
    key: 'limit',
    label: $t('page.manage.task.limit')
  },
  {
    key: 'cron',
    label: $t('page.manage.task.cron'),
    hide: row => row.type === TaskTypeEnum.INTERVAL
  },
  {
    key: 'every',
    label: $t('page.manage.task.interval'),
    hide: row => row.type === TaskTypeEnum.CRON
  },
  {
    key: 'startTime',
    label: $t('page.manage.task.startTime'),
    hide: row => row.type === TaskTypeEnum.CRON,
    render: row => {
      if (!row.startTime) return '';

      return <NTime time={new Date(row.startTime)} />;
    }
  },
  {
    key: 'endTime',
    label: $t('page.manage.task.endTime'),
    hide: row => row.type === TaskTypeEnum.CRON,
    render: row => {
      if (!row.endTime) return '';

      return <NTime time={new Date(row.endTime)} />;
    }
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
    key: 'service',
    label: $t('page.manage.task.service')
  },
  {
    key: 'data',
    label: $t('page.manage.task.params'),
    span: 2
  },
  {
    key: 'remark',
    label: $t('page.manage.common.remark'),
    span: 2
  }
]);

const {
  drawerVisible,
  closeDrawer,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  onDeleted,
  modelVisible,
  detailData,
  handleDetail
} = useTableOperate(data, getData);

async function detail(id: number) {
  if (hasAuth('system:task:read')) {
    handleDetail(id);
  } else {
    window.$message?.error($t('common.noPermission'));
  }
}

async function edit(id: number) {
  const { error, data: taskInfo } = await fetchGetTaskInfo(id);
  if (error) {
    return;
  }
  handleEdit(id, taskInfo as any);
}

async function handleDelete(id: number) {
  const { error } = await fetchDeleteTask(id);
  if (!error) {
    onDeleted();
  }
}

async function handleOnce(id: number) {
  const { error } = await fetchOnceTask(id);
  if (!error) {
    window.$message?.success('启动成功');
    closeDrawer();
    await getData();
  }
}

async function handleStart(id: number) {
  const { error } = await fetchStartTask(id);
  if (!error) {
    window.$message?.success('启动成功');
    closeDrawer();
    await getData();
  }
}

async function handleStop(id: number) {
  const { error } = await fetchStopTask(id);
  if (!error) {
    window.$message?.success('停止成功');
    closeDrawer();
    await getData();
  }
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :bordered="false" size="small" class="flex-1 card-wrapper">
      <div class="h-full flex-col-stretch">
        <SearchForm
          v-model:model="searchParams"
          :fields="taskSearchForm"
          @search="getDataByPage"
          @reset="resetSearchParams"
        />
        <TableHeaderOperation
          v-model:columns="columnChecks"
          prefix="system:task"
          :hide-delete="true"
          :loading="loading"
          @add="handleAdd"
          @refresh="getData"
        />
        <NDataTable
          :columns="columns"
          :data="data"
          size="small"
          flex-height
          :loading="loading"
          :pagination="pagination"
          :scroll-x="scrollX"
          remote
          :row-key="row => row.id"
          class="min-h-300px flex-1"
        />
      </div>
    </NCard>
    <TaskOperateDrawer
      v-model:visible="drawerVisible"
      :operate-type="operateType"
      :row-data="editingData"
      @submitted="getDataByPage"
    />
    <DetailsDescriptions
      v-model:visible="modelVisible"
      :title="$t('page.manage.role.detail')"
      width="60%"
      :label-style="{ width: '100px' }"
      :fields="detailColumns"
      :data="detailData"
    />
  </div>
</template>

<style scoped></style>
