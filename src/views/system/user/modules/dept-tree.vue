<script setup lang="ts">
import type { TreeOption } from 'naive-ui';
import { onMounted, ref } from 'vue';
import { fetchGetDeptTree } from '@/service/api';
import { $t } from '@/locales';
import IcOutlineMoreVert from '~icons/ic/outline-more-vert';

interface Emits {
  (e: 'change'): void;
  (e: 'update:value', deptIds: string[]): void;
}

const props = defineProps<{
  value: string[] | null | undefined;
}>();

const emit = defineEmits<Emits>();

const deptTreeData = ref<TreeOption[]>([]);
const defaultExpandedKeys = ref<string[]>([]);
const deptName = ref('');
const loading = ref(false);
const defaultExpandAll = ref(false);
const dropDownOptions = [
  {
    label: () => $t('common.expand'),
    key: 'expandAll'
  },
  {
    label: () => $t('common.fold'),
    key: 'collapseAll'
  }
];

const deepTree = (data: TreeOption[]): string[] => {
  const ids: string[] = [];

  const traverse = (items: TreeOption[]) => {
    items.forEach(item => {
      ids.push(item.id as string);
      if (item.children && item.children.length > 0) {
        traverse(item.children);
      }
    });
  };

  traverse(data);
  return ids;
};

function arraysEqual(arr1: any[], arr2: any[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((val, index) => val === arr2[index]);
}
const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onClick() {
      const ids = deepTree([option]);
      if (props.value && props.value.length && arraysEqual(props.value, ids)) {
        emit('update:value', []);
      } else {
        emit('update:value', ids);
      }
      emit('change');
    }
  };
};

const getTreeData = async () => {
  loading.value = true;
  const { data, error } = await fetchGetDeptTree({ name: deptName.value });
  loading.value = false;
  if (!error) {
    deptTreeData.value = data;
    const list: string[] = [];
    data.forEach(item => {
      if (item.children && item.children.length) {
        list.push(item.id);
      }
    });
    defaultExpandedKeys.value = list;
  } else {
    window.$message?.error(error.message);
  }
};

const handleSelect = (key: string) => {
  if (key === 'expandAll') {
    defaultExpandAll.value = true;
  } else if (key === 'collapseAll') {
    defaultExpandedKeys.value = [];
    defaultExpandAll.value = false;
  }
};

onMounted(() => {
  getTreeData();
});
</script>

<template>
  <div class="h-full w-full overflow-hidden">
    <div class="flex items-center">
      <span class="mr-1 whitespace-nowrap text-[1rem] font-bold">{{ $t('page.manage.dept.title') }}</span>
      <NInputGroup class="mr-1 flex-1 items-center">
        <NInput
          v-model:value="deptName"
          size="small"
          :placeholder="$t('page.manage.dept.searchPlaceholder')"
          :disabled="loading"
          clearable
          @keyup.enter="getTreeData"
        />

        <NButton type="primary" size="small" ghost @click="getTreeData">
          <template #icon>
            <icon-ic-round-search class="text-icon" />
          </template>
        </NButton>
      </NInputGroup>
      <NDropdown :options="dropDownOptions" placement="bottom" trigger="click" @select="handleSelect">
        <NIcon class="mb-1" size="16"><IcOutlineMoreVert /></NIcon>
      </NDropdown>
    </div>
    <NSpin :show="loading">
      <NTree
        class="mt-8 h-full w-full overflow-auto"
        block-line
        :data="deptTreeData"
        label-field="name"
        key-field="id"
        :default-expanded-keys="defaultExpandedKeys"
        :default-expand-all="defaultExpandAll"
        :node-props="nodeProps"
      />
    </NSpin>
  </div>
</template>

<style scoped></style>
