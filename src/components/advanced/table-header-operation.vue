<script setup lang="ts">
import { useAuth } from '@/hooks/business/auth';
import { $t } from '@/locales';
import { generatePrefix } from '@/utils/common';

defineOptions({
  name: 'TableHeaderOperation'
});

interface Props {
  itemAlign?: NaiveUI.Align;
  disabledDelete?: boolean;
  loading?: boolean;
  prefix: string;
  treeTable?: boolean;
}

defineProps<Props>();

interface Emits {
  (e: 'add'): void;
  (e: 'delete'): void;
  (e: 'refresh'): void;
  (e: 'expand'): void;
  (e: 'fold'): void;
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

function expand() {
  emit('expand');
}

function fold() {
  emit('fold');
}
</script>

<template>
  <NSpace :align="itemAlign" wrap justify="space-between" class="pb-8px lt-sm:w-200px">
    <NSpace v-show="treeTable" :align="itemAlign" wrap justify="start">
      <NButton size="small" @click="expand">
        <template #icon>
          <icon-ic-twotone-unfold-more class="text-icon" />
        </template>
        {{ $t('common.expand') }}
      </NButton>
      <NButton size="small" @click="fold">
        <template #icon>
          <icon-ic-twotone-unfold-less class="text-icon" />
        </template>
        {{ $t('common.fold') }}
      </NButton>
    </NSpace>
    <NSpace :align="itemAlign" wrap justify="end">
      <slot name="prefix"></slot>
      <slot name="default">
        <!-- 把 prefix 和 :create 拼接起来 就可以和后端的权限对应 -->
        <NButton v-if="hasAuth(generatePrefix(prefix, 'create'))" size="small" ghost type="primary" @click="add">
          <template #icon>
            <icon-ic-round-plus class="text-icon" />
          </template>
          {{ $t('common.add') }}
        </NButton>
        <NPopconfirm v-if="hasAuth(generatePrefix(prefix, 'delete'))" @positive-click="batchDelete">
          <template #trigger>
            <NButton size="small" ghost type="error" :disabled="disabledDelete">
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
