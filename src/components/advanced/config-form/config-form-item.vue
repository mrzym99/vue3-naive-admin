<script setup lang="ts">
import type { ComponentType } from './component-map';
import { componentMap, optionsComponentMap } from './component-map';
import ConfigFormItemOptions from './config-form-item-options.vue';
import type { ConfigFormItem } from './config-form-type';

defineOptions({ name: 'ConfigFormItem' });

type ComponentProps = Record<string, any> | undefined;

defineProps<{
  field: ConfigFormItem;
}>();

const value = defineModel<Array<any> | number | string | boolean>('value');

const getComponent = (type: ComponentType) => {
  if (!componentMap[type]) {
    throw new Error(`Component ${type} is not found`);
  }
  return componentMap[type];
};

const getOptionsComponent = (type: ComponentType) => {
  const comp = optionsComponentMap[type as keyof typeof optionsComponentMap];
  return comp;
};

const getComponentProps = (componentProps: ComponentProps) => {
  if (!componentProps) return {};
  return Object.keys(componentProps).reduce((prev: any, key) => {
    if (!/^on([A-Z])/.test(key)) {
      const eventKey = key.replace(/^on([A-Z])/, '$1').toLocaleLowerCase();
      prev[eventKey] = componentProps[key];
    }
    return prev;
  }, {});
};

const getDisabled = (field: ConfigFormItem) => {
  const { disabled } = field;
  if (typeof disabled === 'function') {
    return disabled();
  }

  return disabled;
};

/** 表单组件事件 */
const componentEvents = (componentProps: ComponentProps) => {
  if (!componentProps) return {};
  return Object.keys(componentProps).reduce((prev: any, key) => {
    if (/^on([A-Z])/.test(key)) {
      // e.g: onChange => change
      const eventKey = key.replace(/^on([A-Z])/, '$1').toLocaleLowerCase();
      prev[eventKey] = componentProps[key];
    }
    return prev;
  }, {});
};
</script>

<template>
  <component
    :is="getComponent(field.type)"
    v-bind="getComponentProps(field.props)"
    v-model:value="value"
    clearable
    :disabled="getDisabled(field)"
    v-on="componentEvents(field.props)"
  >
    <!-- 部分组件 如 RadioGroup 不能通过传入 Options 来渲染这里特殊处理 -->
    <ConfigFormItemOptions
      v-if="getOptionsComponent(field.type) && field.options"
      :options="field.options"
      :component-id="getOptionsComponent(field.type)"
    />
  </component>
</template>
