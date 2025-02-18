<script setup lang="ts">
import { computed } from 'vue';
import { useNaiveForm } from '@/hooks/common/form';
import type { ComponentType } from './componentMap';
import { componentMap, optionsComponentMap } from './componentMap';
import type { ConfigFormType } from './type';
import RenderOptions from './render-options.vue';

defineOptions({
  name: 'ConfigForm'
});

interface Props {
  fields: ConfigFormType;
  span?: number; // 一行占多少个
  labelPlacement?: 'left' | 'top';
  labelWidth?: number | string | 'auto';
  requireMarkPlacement?: 'left' | 'right' | 'right-hanging';
}

type ComponentProps = Record<string, any> | undefined;

const props = withDefaults(defineProps<Props>(), {
  span: 12,
  labelPlacement: 'left',
  labelWidth: 'auto',
  requireMarkPlacement: 'right'
});

const { formRef, validate, restoreValidation } = useNaiveForm();

const model = defineModel<Record<string, any>>('model', { default: () => ({}), type: Object });

const rules = computed<Record<string, App.Global.FormRule[]>>(() => {
  return props.fields.reduce(
    (acc, field) => {
      if (field.required) {
        acc[field.key] = [
          {
            required: true
          }
        ];
      }
      if (field.rules) {
        Object.assign(acc[field.key], field.rules);
      }
      return acc;
    },
    {} as Record<string, App.Global.FormRule[]>
  );
});

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

const finalFields = computed<ConfigFormType>(() => {
  return props.fields.filter(item => !item.hide);
});

defineExpose({
  validate,
  restoreValidation
});
</script>

<template>
  <NForm
    ref="formRef"
    :model="model"
    :rules="rules"
    v-bind="$attrs"
    :label-placement="labelPlacement"
    :label-width="labelWidth"
    :require-mark-placement="requireMarkPlacement"
  >
    <NGrid responsive="screen" item-responsive :x-gap="16">
      <NFormItemGi
        v-for="field in finalFields"
        :key="field.key"
        :span="field.span || span"
        :label="field.label"
        :path="field.key"
      >
        <component
          :is="getComponent(field.type)"
          v-bind="getComponentProps(field.props)"
          v-model:value="model[field.key]"
          :allow-clear="true"
          :disabled="field.disabled"
          v-on="componentEvents(field.props)"
        >
          <!-- 部分组件 如 RadioGroup 不能通过传入 Options 来渲染这里特殊处理 -->
          <RenderOptions
            v-if="getOptionsComponent(field.type) && field.options"
            :options="field.options"
            :component-id="getOptionsComponent(field.type)"
          />
        </component>
      </NFormItemGi>
    </NGrid>
  </NForm>
</template>

<style scoped></style>
