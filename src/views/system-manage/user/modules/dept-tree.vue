<script setup lang="ts">
import type { TreeOption } from 'naive-ui';

interface DeptTreeProps {
  rowData: TreeOption[];
  defaultExpandedKeys?: Array<string | number>;
}
defineProps<DeptTreeProps>();

interface Emits {
  (e: 'select'): void;
}

const emit = defineEmits<Emits>();

const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onClick() {
      console.log(option);
    }
  };
};

emit('select');
</script>

<template>
  <NTree
    block-line
    :data="rowData"
    :default-expanded-keys="defaultExpandedKeys"
    expand-on-click
    :node-props="nodeProps"
  />
</template>

<style scoped></style>
