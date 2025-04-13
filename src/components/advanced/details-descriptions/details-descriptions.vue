<script setup lang="ts">
import { NDescriptions, NDescriptionsItem, NModal } from 'naive-ui';
import type { VNode } from 'vue';
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';
import type { DescriptionItem, DetailsDescriptionsProps, RenderFn } from './type';

defineOptions({
  name: 'DetailsDescriptions'
});

const appStore = useAppStore();

const visible = defineModel<boolean>('visible', {
  default: false
});

const props = withDefaults(defineProps<DetailsDescriptionsProps>(), {
  column: 2,
  title: $t('common.detail')
});

const descriptionItems = computed<DescriptionItem[]>(() => {
  const items: DescriptionItem[] = [];
  props.fields.forEach(item => {
    const { key, label, span, render, hide } = item;
    const itemValue = props.data[key];

    const isHide = typeof hide === 'function' ? hide(props.data) : hide;
    if (!isHide) {
      items.push({
        key,
        label,
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
  <NModal
    v-model:show="visible"
    :class="appStore.isMobile ? 'full-screen' : ''"
    v-bind="$attrs"
    preset="dialog"
    :title="title"
    :mask-closable="true"
    :style="{ width: !appStore.isMobile ? width : '' }"
  >
    <NDescriptions
      label-placement="left"
      :column="appStore.isMobile ? 1 : column"
      :bordered="true"
      :content-style="{ padding: '16px' }"
      v-bind="$attrs"
    >
      <NDescriptionsItem v-for="item in descriptionItems" :key="item.key" :span="item.span">
        <template #label>
          <span class="mt-5px inline-block" :title="item.label">
            {{ item.label }}
          </span>
        </template>
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

<style lang="scss" scoped>
:deep(.n-descriptions-table-header) {
  vertical-align: top;
}
</style>
