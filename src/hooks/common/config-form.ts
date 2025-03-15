import { computed, reactive } from 'vue';
import type { ConfigFormObjectType, Recordable } from '@/components/advanced/config-form/config-form-type';

type FieldsFn<T extends Recordable = Recordable> = () => ConfigFormObjectType<T>;

function useConfigForm<T extends Recordable = Recordable>(fields: FieldsFn<T>) {
  // 既要 响应式(reactive) 又要 国际化的响应式(箭头函数 + computed)
  const formFields = computed<ConfigFormObjectType<T>>(() => reactive(fields()));
  return formFields;
}

export { useConfigForm };
