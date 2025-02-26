<script setup lang="ts">
import type { TreeOption } from 'naive-ui';
import { onMounted, ref } from 'vue';
import { fetchGetDeptTree } from '@/service/api';
import IcOutlineMoreVert from '~icons/ic/outline-more-vert';

interface Emits {
  (e: 'select', deptId: string): void;
}

const emit = defineEmits<Emits>();

const deptTreeData = ref<TreeOption[]>([]);
const defaultExpandedKeys = ref<string[]>([]);
const deptName = ref('');
const loading = ref(false);
const defaultExpandAll = ref(false);
const dropDownOptions = [
  {
    label: '展开所有',
    key: 'expandAll'
  },
  {
    label: '折叠所有',
    key: 'collapseAll'
  }
];

const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onClick() {
      emit('select', option.id as string);
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
      <span class="mr-1 whitespace-nowrap text-[1rem] font-bold">部门</span>
      <NInputGroup class="mr-1 flex-1 items-center">
        <NInput
          v-model:value="deptName"
          size="small"
          placeholder="请输入部门名称"
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
