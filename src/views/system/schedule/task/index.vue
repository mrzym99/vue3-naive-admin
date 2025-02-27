<script setup lang="tsx">
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { useAppStore } from '@/store/modules/app';
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
import type { SearchFormType } from '@/components/advanced/search-form';
import { TaskTypeRecord, enableStatusRecord } from '@/constants/business';
import TaskOperateDrawer from './modules/task-operate-drawer.vue';

const appStore = useAppStore();

const taskSearchForm: SearchFormType<Api.SystemManage.Task> = [
  {
    key: 'name',
    label: '任务名称',
    type: 'Input',
    props: {
      placeholder: '请输入任务名称'
    }
  },
  {
    key: 'limit',
    label: '任务值',
    type: 'Input',
    props: {
      placeholder: '请输入任务值'
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
          label: $t('common.enable'),
          value: 1
        },
        {
          label: $t('common.disable'),
          value: 0
        }
      ]
    }
  }
];

const { columns, columnChecks, data, loading, pagination, getDataByPage, getData, searchParams, resetSearchParams } =
  useTable({
    apiFn: fetchGetTaskList,
    showTotal: true,
    apiParams: {
      currentPage: 1,
      pageSize: 10,
      name: '',
      status: null
    },
    columns: () => [
      {
        key: 'name',
        title: '任务名称', // $t('page.manage.task.task'),
        align: 'left',
        width: 150,
        ellipsis: {
          tooltip: true
        }
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
        key: 'type',
        title: '类型',
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
        title: '调用服务', // $t('page.manage.task.task'),
        width: 200,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'data',
        title: '执行参数',
        width: 220,
        ellipsis: {
          tooltip: true
        }
      },
      {
        key: 'remark',
        title: '备注',
        width: 200,
        ellipsis: {
          tooltip: true
        }
      },
      {
        fixed: 'right',
        key: 'operate',
        title: $t('common.operate'),
        align: 'center',
        width: 260,
        render: row => (
          <div class="flex justify-items-start gap-8px">
            <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
              {$t('common.edit')}
            </NButton>

            {!row.status ? (
              <NPopconfirm onPositiveClick={() => handleStart(row.id)}>
                {{
                  default: () => `${$t('page.manage.task.startTask')}?`,
                  trigger: () => (
                    <NButton type="primary" ghost size="small">
                      {$t('page.manage.task.startTask')}
                    </NButton>
                  )
                }}
              </NPopconfirm>
            ) : (
              ''
            )}
            {!row.status ? (
              <NPopconfirm onPositiveClick={() => handleOnce(row.id)}>
                {{
                  default: () => `${$t('page.manage.task.onceTask')}?`,
                  trigger: () => (
                    <NButton type="primary" ghost size="small">
                      {$t('page.manage.task.onceTask')}
                    </NButton>
                  )
                }}
              </NPopconfirm>
            ) : (
              ''
            )}
            {row.status ? (
              <NPopconfirm onPositiveClick={() => handleStop(row.id)}>
                {{
                  default: () => `${$t('page.manage.task.stopTask')}?`,
                  trigger: () => (
                    <NButton type="error" ghost size="small">
                      {$t('page.manage.task.stopTask')}
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

const { drawerVisible, closeDrawer, operateType, editingData, handleAdd, handleEdit, onDeleted } = useTableOperate(
  data,
  getData
);

async function edit(id: string) {
  const { error, data: taskInfo } = await fetchGetTaskInfo(id);
  if (error) {
    return;
  }
  handleEdit(id, taskInfo as any);
}

async function handleDelete(id: string) {
  const { error } = await fetchDeleteTask(id);
  if (!error) {
    onDeleted();
  }
}

async function handleOnce(id: string) {
  const { error } = await fetchOnceTask(id);
  if (!error) {
    window.$message?.success('启动成功');
    closeDrawer();
    await getData();
  }
}

async function handleStart(id: string) {
  const { error } = await fetchStartTask(id);
  if (!error) {
    window.$message?.success('启动成功');
    closeDrawer();
    await getData();
  }
}

async function handleStop(id: string) {
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
    <NCard :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
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
          :flex-height="!appStore.isMobile"
          :loading="loading"
          :pagination="pagination"
          remote
          :row-key="row => row.id"
          class="sm:h-full"
        />
      </div>
    </NCard>
    <TaskOperateDrawer
      v-model:visible="drawerVisible"
      :operate-type="operateType"
      :row-data="editingData"
      @submitted="getDataByPage"
    />
  </div>
</template>

<style scoped></style>
