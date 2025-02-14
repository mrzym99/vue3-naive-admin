<script setup lang="ts">
import { computed, ref } from 'vue';
import { $t } from '@/locales';
import { useNaiveForm } from '@/hooks/common/form';
import { translateOptions } from '@/utils/common';

defineOptions({
  name: 'SearchForm'
});

interface Props {
  fields: Form.SearchForm;
}

interface Emits {
  (e: 'reset'): void;
  (e: 'search', value: any): void;
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();

const model = ref<Record<string, any>>({});

const rules = computed<Record<string, App.Global.FormRule[]>>(() => {
  return props.fields.reduce(
    (acc, field) => {
      if (field.rules) {
        acc[field.key] = field.rules;
      }
      return acc;
    },
    {} as Record<string, App.Global.FormRule[]>
  );
});

async function reset() {
  await restoreValidation();
  emit('reset');
}

async function search() {
  await validate();
  emit('search', model.value);
}
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="80">
      <NGrid responsive="screen" item-responsive>
        <NFormItemGi
          v-for="field in props.fields"
          :key="field.key"
          span="24 s:12 m:6"
          :label="$t(field.label)"
          :path="field.key"
          class="pr-24px"
        >
          <NInput
            v-if="field.type === 'input'"
            v-model:value="model[field.key]"
            :placeholder="field.placeholder || $t(`page.manage.user.form.${field.key}`)"
          />
          <NSelect
            v-else-if="field.type === 'select'"
            v-model:value="model[field.key]"
            :placeholder="field.placeholder || $t(`page.manage.user.form.${field.key}`)"
            :options="translateOptions(field.options || [])"
            clearable
          />
        </NFormItemGi>
        <NFormItemGi span="24 m:12" class="pr-24px">
          <NSpace class="w-full" justify="end">
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
          </NSpace>
        </NFormItemGi>
      </NGrid>
    </NForm>
  </NCard>
</template>

<style scoped></style>
