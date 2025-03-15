import { computed } from 'vue';
import type { DetailsDescriptionsType, Recordable } from '@/components/advanced/details-descriptions';

type FieldsFn<T extends Recordable = Recordable> = () => DetailsDescriptionsType<T>;

function useDetailDescriptions<T extends Recordable>(fields: FieldsFn<T>) {
  return computed<DetailsDescriptionsType<T>>(fields);
}

export { useDetailDescriptions };
