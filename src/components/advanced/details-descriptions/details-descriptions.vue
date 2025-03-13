<script setup lang="ts">
import { NDescriptions, NDescriptionsItem, NModal } from 'naive-ui';
import type { VNode } from 'vue';
import { computed } from 'vue';
import type { DescriptionItem, DetailsDescriptionsProps, RenderFn } from './type';

defineOptions({
  name: 'DetailsDescriptions'
});

const visible = defineModel<boolean>('visible', {
  default: false
});

const props = withDefaults(defineProps<DetailsDescriptionsProps>(), {
  column: 2,
  title: '详情'
});

const descriptionItems = computed<DescriptionItem[]>(() => {
  const items: DescriptionItem[] = [];
  props.fields.forEach(item => {
    const { key, label, type, span, render, hide } = item;
    const itemValue = props.data[key];

    const isHide = typeof hide === 'function' ? hide(props.data) : hide;
    if (!isHide) {
      items.push({
        key,
        label,
        type,
        span,
        render,
        value: itemValue
      });
    }
  });
  return items;
});

const renderContent = (render: RenderFn<typeof props.data>): Array<VNode | string> => {
  const vNode = render(props.data);
  if (Array.isArray(vNode)) {
    return vNode;
  }
  return vNode ? [vNode] : [];
};
</script>

<template>
  <NModal v-model:show="visible" v-bind="$attrs" preset="dialog" :title="title" :mask-closable="true">
    <NDescriptions label-placement="left" :column="column" :bordered="true" :content-style="{ padding: '16px' }">
      <NDescriptionsItem v-for="item in descriptionItems" :key="item.key" :span="item.span" :label="item.label">
        <template v-if="item.render">
          <template v-for="node in renderContent(item.render)" :key="node">
            <span v-if="typeof node === 'string'">{{ node }}</span>
            <component :is="node" v-else />
          </template>
        </template>
        <template v-else>
          {{ item.value }}
        </template>
      </NDescriptionsItem>
    </NDescriptions>
  </NModal>
</template>

<style scoped></style>
