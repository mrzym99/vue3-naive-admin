<script setup lang="ts">
import { computed } from 'vue';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'ConfigForm'
});

interface Props {
  fields: Form.ConfigForm;
}

const props = defineProps<Props>();

const { formRef, validate } = useNaiveForm();

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

const model = defineModel<Record<string, any>>('model', { default: () => ({}), type: Object });

const finalFields = computed<Form.ConfigForm>(() => {
  return props.fields.filter(item => !item.hide);
});

defineExpose({
  validate
});
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules">
    <NGrid responsive="screen" item-responsive>
      <NFormItemGi
        v-for="field in finalFields"
        :key="field.key"
        span="24 s:12 m:6"
        :label="field.label"
        :path="field.key"
      >
        <NInput
          v-if="field.type === 'input'"
          v-model:value="model[field.key]"
          :placeholder="model[field.key].placeholder || ''"
        />
        <NSelect
          v-else-if="field.type === 'select'"
          v-model:value="model[field.key]"
          :placeholder="model[field.key].placeholder || ''"
          :options="field.options || []"
          clearable
        />
        <NDatePicker
          v-else-if="field.type === 'dateRange'"
          v-model:value="model[field.key]"
          type="daterange"
          :placeholder="model[field.key].placeholder || ''"
        />
        <NRadioGroup v-else-if="field.type === 'radio'" v-model:value="model[field.key]">
          <NRadio v-for="item in field.options" :key="item.value" :value="item.value" :label="$t(item.label)" />
        </NRadioGroup>
      </NFormItemGi>
    </NGrid>
  </NForm>
</template>

<style scoped></style>
