<script setup lang="ts">
import { NDescriptions, NDescriptionsItem, NModal } from 'naive-ui';
import { computed } from 'vue';
import type { DescriptionItem, DetailsDescriptionsProps } from './type';

defineOptions({
  name: 'DetailsDescriptions'
});

const visible = defineModel<boolean>('visible', {
  default: false
});

const props = withDefaults(defineProps<DetailsDescriptionsProps>(), {
  column: 2,
  width: '50%',
  title: '详情'
});

const descriptionItems = computed<DescriptionItem[]>(() => {
  const items: DescriptionItem[] = [];
  props.fields.forEach(item => {
    const { key, label, type, span, render } = item;
    const itemValue = props.data[key];
    items.push({
      key,
      label,
      type,
      span,
      render,
      value: itemValue
    });
  });
  return items;
});
</script>

<template>
  <NModal v-model:show="visible" :width="width" preset="dialog" :title="title" :mask-closable="true">
    <NDescriptions label-placement="left" :column="column" :bordered="true" :content-style="{ padding: '16px' }">
      <NDescriptionsItem v-for="item in descriptionItems" :key="item.key" :label="item.label">
        <template v-if="item.render">
          <component :is="item.render(item)" />
        </template>
        <template v-else>
          {{ item.value }}
        </template>
      </NDescriptionsItem>
    </NDescriptions>
  </NModal>
</template>

<style scoped></style>
