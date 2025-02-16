<script setup lang="ts">
import { computed, ref } from 'vue';
import { $t } from '@/locales';
import { useNaiveForm } from '@/hooks/common/form';

defineOptions({
  name: 'SearchForm'
});

interface Props {
  fields: Form.SearchForm;
}

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();

const model = defineModel<Record<string, any>>('model', { default: () => ({}), type: Object });

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

const isCllapse = ref(false);
const collapse = () => {
  isCllapse.value = !isCllapse.value;
};

const finalFields = computed<Form.SearchForm>(() => {
  if (isCllapse.value) {
    return props.fields.filter(item => item.key !== 'username');
  }
  return props.fields;
});
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
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="80">
      <NGrid responsive="screen" item-responsive>
        <NFormItemGi
          v-for="field in finalFields"
          :key="field.key"
          span="24 s:12 m:6"
          :label="field.label"
          :path="field.key"
          class="pr-24px"
        >
          <NInput v-if="field.type === 'input'" v-model:value="model[field.key]" :placeholder="field.placeholder" />
          <!-- translateOptions( -->
          <NSelect
            v-else-if="field.type === 'select'"
            v-model:value="model[field.key]"
            :placeholder="field.placeholder"
            :options="field.options || []"
            clearable
          />
        </NFormItemGi>
        <NFormItemGi span="24 s:12 m:6" class="pr-24px">
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
            <NButton class="!p-0" type="primary" :bordered="false" ghost @click="collapse">
              <template #icon>
                <icon-ic-outline-keyboard-arrow-up v-if="!isCllapse" class="text-icon" />
                <icon-ic-outline-keyboard-arrow-down v-else class="text-icon" />
              </template>
            </NButton>
          </NSpace>
        </NFormItemGi>
      </NGrid>
    </NForm>
  </NCard>
</template>

<style scoped></style>
