import { computed } from 'vue';
import type { Recordable, SearchFormArrayType } from '@/components/advanced/search-form';

type FieldsFn<T extends Recordable = Recordable> = () => SearchFormArrayType<T>;

function useSearchForm<T extends Recordable = Recordable>(fields: FieldsFn<T>) {
  // 直接返回 fields() 的计算值，无需 reactive
  const formFields = computed<SearchFormArrayType<T>>(() => fields());
  return formFields;
}

export { useSearchForm };
