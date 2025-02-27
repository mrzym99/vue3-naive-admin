<script setup lang="ts">
import { computed, ref } from 'vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { $t } from '@/locales';
import { useNaiveForm } from '@/hooks/common/form';
import type { ConfigFormArrayType } from '../config-form/config-form-type';

defineOptions({
  name: 'SearchForm'
});

interface Props {
  fields: ConfigFormArrayType;
  labelWidth?: number;
  labelPlacement?: 'left' | 'top';
}

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const props = withDefaults(defineProps<Props>(), {
  labelWidth: 80,
  labelPlacement: 'left'
});

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();
const activeBreakpoint = useBreakpoints(breakpointsTailwind).active();

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

const isCllapse = ref(false);
const collapse = () => {
  isCllapse.value = !isCllapse.value;
};

const span = (breakpoints: string) => {
  switch (breakpoints) {
    case 'sm':
      return 24;
    case 'md':
      return 12;
    case 'lg':
      return 8;
    default:
      return 6;
  }
};

const finalFields = computed<ConfigFormArrayType>(() => {
  if (isCllapse.value) {
    return props.fields.slice(0, 24 / span(activeBreakpoint.value) - 1);
  }
  return props.fields;
});

const collapseSpan = (breakpoints: string) => {
  const currentSpan = span(breakpoints);
  const rowNumber = 24 / currentSpan;
  const finalSpan = 24 - (finalFields.value.length % rowNumber) * currentSpan;
  return finalSpan;
};

const showCollapse = (breakpoints: string) => {
  return props.fields.length >= 24 / span(breakpoints);
};
async function reset() {
  await restoreValidation();
  emit('reset');
}

async function search() {
  await validate();
  emit('search');
}
</script>

<template>
  <NForm
    ref="formRef"
    :model="model"
    :rules="rules"
    v-bind="$attrs"
    :label-width="labelWidth"
    :label-placement="labelPlacement"
  >
    <NGrid responsive="screen" item-responsive :x-gap="16">
      <NFormItemGi
        v-for="field in finalFields"
        :key="field.key"
        :span="span(activeBreakpoint)"
        :label="field.label"
        :path="field.key"
      >
        <ConfigFormItem v-model:value="model[field.key]" :field="field" :model="model" />
      </NFormItemGi>
      <NFormItemGi :span="collapseSpan(activeBreakpoint)">
        <NSpace class="w-full" justify="end" :wrap="false">
          <NButton @click="reset">
            <template #icon>
              <icon-ic-round-refresh class="text-icon" />
            </template>
            {{ $t('common.reset') }}
          </NButton>
          <NButton type="primary" ghost @click="search">
            <template #icon>
              <icon-ic-round-search class="text-icon" />
            </template>
            {{ $t('common.search') }}
          </NButton>
          <div v-if="showCollapse(activeBreakpoint)" class="grid h-full place-items-center">
            <icon-ic-outline-keyboard-arrow-down
              class="cursor-pointer text-icon transition-500 !text-2xl"
              :class="[isCllapse ? '' : 'rotate-x-180']"
              @click="collapse"
            />
          </div>
        </NSpace>
      </NFormItemGi>
    </NGrid>
  </NForm>
</template>

<style scoped></style>
