<script setup lang="ts">
import { computed, nextTick, ref, useSlots, watch } from 'vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { useNaiveForm } from '@/hooks/common/form';
import { getLocale } from '@/locales';
import type { ConfigFormArrayType, ConfigFormType } from './config-form-type';

defineOptions({
  name: 'ConfigForm'
});

interface Props {
  fields: ConfigFormType;
  span?: number; // 一行占多少个
  labelPlacement?: 'left' | 'top';
  labelWidth?: number | string;
  requireMarkPlacement?: 'left' | 'right' | 'right-hanging';
}

const props = withDefaults(defineProps<Props>(), {
  span: 12,
  labelPlacement: 'left',
  labelWidth: 0,
  requireMarkPlacement: 'right'
});

const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = () => breakpoints.smaller('sm');
const { formRef, validate, restoreValidation } = useNaiveForm();

const model = defineModel<Record<string, any>>('model', { default: () => ({}), type: Object });

const rules = computed<Record<string, App.Global.FormRule[]>>(() => {
  return generateFieldArr().reduce(
    (acc, field) => {
      const required = typeof field.required === 'function' ? field.required(model) : field.required;
      if (required) {
        const message = field.label;
        acc[field.key] = [
          {
            required: true,
            message: `${message}${getLocale.value === 'zh-CN' ? '必填' : ' is Required'}`
            // trigger: field.type === 'Input' ? 'blur' : 'change'
          }
        ];
      } else {
        acc[field.key] = [];
      }
      if (field.rules) {
        acc[field.key] = [...acc[field.key], ...field.rules];
      }

      return acc;
    },
    {} as Record<string, App.Global.FormRule[]>
  );
});

const finalFields = computed<ConfigFormArrayType>(() => {
  const fields = generateFieldArr();
  return fields.filter(item => (typeof item.hide === 'function' ? !item.hide(model) : !item.hide));
});

// 根据传入的 fields 生成 fields 数组
function generateFieldArr(): ConfigFormArrayType {
  const fields = typeof props.fields === 'function' ? props.fields() : props.fields;
  return Object.entries(fields).map(([_pKey, pValue]) => {
    return {
      ...pValue
    };
  }) as any;
}

const gridKey = ref(0); // 新增 gridKey

// 使用 key 强制刷新 form 布局 以解决 grid 在fields变化时 新出现的 form-item 布局不生效的问题
watch(finalFields, () => {
  // 使用 nextTick 是为了确保 属性变化完全后再更新
  nextTick(() => {
    gridKey.value += 1;
  });
});

const slots = computed(() => {
  return useSlots();
});

const computedLabelWidth = computed(() => {
  if (props.labelWidth) return props.labelWidth;
  if (getLocale.value === 'zh-CN') {
    return 120;
  }
  return 150;
});

const returnResponsiveSpan = (span: number | undefined) => {
  if (isMobile().value) {
    return 24;
  }

  return span || props.span;
};

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
    :label-width="computedLabelWidth"
    :require-mark-placement="requireMarkPlacement"
  >
    <NGrid responsive="screen" item-responsive>
      <NFormItemGi
        v-for="field in finalFields"
        :key="field.key"
        :span="returnResponsiveSpan(field.span)"
        :label="field.label"
        :path="field.key"
      >
        <ConfigFormItem v-model:value="model[field.key]" :field="field" :model="model">
          <template v-for="name of Object.keys(slots)" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps"></slot>
          </template>
        </ConfigFormItem>
      </NFormItemGi>
    </NGrid>
  </NForm>
</template>

<style scoped></style>
