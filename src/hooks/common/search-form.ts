import type { Reactive } from 'vue';
import { computed, reactive } from 'vue';
import type { Recordable, SearchFormArrayType } from '@/components/advanced/search-form';

type FieldsFn<T extends Recordable = Recordable> = () => SearchFormArrayType<T>;

function useSearchForm<T extends Recordable = Recordable>(fields: FieldsFn<T>) {
  const formFields = computed<Reactive<SearchFormArrayType<T>>>(() => reactive(fields()));
  return formFields;
}

export { useSearchForm };
