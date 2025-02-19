<script setup lang="ts">
import { computed } from 'vue';
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
        <ConfigFormItem v-model:value="model[field.key]" :field="field" />
      </NFormItemGi>
    </NGrid>
  </NForm>
</template>

<style scoped></style>
