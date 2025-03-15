<script setup lang="ts">
import { useAuth } from '@/hooks/business/auth';
import { $t } from '@/locales';
import { generatePrefix } from '@/utils/common';

defineOptions({
  name: 'TableHeaderOperation'
});

interface Props {
  prefix: string;
  itemAlign?: NaiveUI.Align;
  hideDelete?: boolean;
  disabledDelete?: boolean;
  hideAdd?: boolean;
  loading?: boolean;
  treeTable?: boolean;
}

defineProps<Props>();

interface Emits {
  (e: 'add'): void;
  (e: 'delete'): void;
  (e: 'refresh'): void;
  (e: 'toggleExpand'): void;
}

const emit = defineEmits<Emits>();

const columns = defineModel<NaiveUI.TableColumnCheck[]>('columns', {
  default: () => []
});

const { hasAuth } = useAuth();

function add() {
  emit('add');
}

function batchDelete() {
  emit('delete');
}

function refresh() {
  emit('refresh');
}

function toggleExpand() {
  emit('toggleExpand');
}
</script>

<template>
  <NSpace :align="itemAlign" wrap justify="space-between" class="pb-8px lt-sm:w-200px">
    <NSpace v-show="treeTable" :align="itemAlign" wrap justify="start">
      <NButton size="small" @click="toggleExpand">
        <template #icon>
          <icon-ic-twotone-unfold-more class="text-icon" />
        </template>
        {{ `${$t('common.expand')}/${$t('common.fold')}` }}
      </NButton>
    </NSpace>
    <NSpace :align="itemAlign" wrap justify="end">
      <slot name="prefix"></slot>
      <slot name="default">
        <!-- 把 prefix 和 :create 拼接起来 就可以和后端的权限对应 -->
        <NButton
          v-if="!hideAdd"
          :disabled="!hasAuth(generatePrefix(prefix, 'create'))"
          size="small"
          ghost
          type="primary"
          @click="add"
        >
          <template #icon>
            <icon-ic-round-plus class="text-icon" />
          </template>
          {{ $t('common.add') }}
        </NButton>
        <NPopconfirm v-if="!hideDelete" @positive-click="batchDelete">
          <template #trigger>
            <NButton
              size="small"
              ghost
              type="error"
              :disabled="disabledDelete || !hasAuth(generatePrefix(prefix, 'delete'))"
            >
              <template #icon>
                <icon-ic-round-delete class="text-icon" />
              </template>
              {{ $t('common.batchDelete') }}
            </NButton>
          </template>
          {{ $t('common.confirmDelete') }}
        </NPopconfirm>
      </slot>
      <NButton size="small" @click="refresh">
        <template #icon>
          <icon-mdi-refresh class="text-icon" :class="{ 'animate-spin': loading }" />
        </template>
        {{ $t('common.refresh') }}
      </NButton>
      <TableColumnSetting v-model:columns="columns" />
      <slot name="suffix"></slot>
    </NSpace>
  </NSpace>
</template>

<style scoped></style>
