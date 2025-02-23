<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useNaiveForm } from '@/hooks/common/form';
import type { ConfigFormType } from './config-form-type';

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
      const required = typeof field.required === 'function' ? field.required() : field.required;
      if (required) {
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

const finalFields = computed<ConfigFormType>(() => {
  return props.fields.filter(item => (typeof item.hide === 'function' ? !item.hide() : !item.hide));
});
const gridKey = ref(0); // 新增 gridKey

// 使用 key 强制刷新 form 布局 以解决 grid 在fields变化时 新出现的 form-item 布局不生效的问题
watch(finalFields, () => {
  gridKey.value += 1;
});

defineExpose({
  validate,
  restoreValidation
});
</script>

<template>
  <NForm
    :key="gridKey"
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
        :key="field.label"
        :span="field.span || span"
        :label="field.label"
        :path="field.key"
      >
        <ConfigFormItem v-model:value="model[field.key]" :field="field" />
      </NFormItemGi>
    </NGrid>
  </NForm>
</template>

<style scoped></style>
