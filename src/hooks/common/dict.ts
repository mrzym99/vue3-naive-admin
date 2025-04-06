import type { ComputedRef } from 'vue';
import { computed, reactive } from 'vue';
import { fetchGetDictItemListByCode } from '@/service/api';

type Dicts = {
  [key: string]: Options[];
};

type Options = {
  label: string;
  value: string | number;
};

const dicts: Dicts = reactive({});

async function getDicts(dictTypes: string[] | string): Promise<void> {
  let dictTypeList: string[] = [];
  if (!Array.isArray(dictTypes)) {
    dictTypeList = dictTypes.split(',');
  } else {
    dictTypeList = dictTypes;
  }

  const list = await Promise.all(
    dictTypeList.map(async dictType => {
      const { error, data } = await fetchGetDictItemListByCode(dictType);
      if (error) {
        console.error(`Failed to fetch dict items for ${dictType}:`, error);
        return [];
      }

      return data.map(item => ({
        label: item.label,
        value: item.value
      }));
    })
  );

  dictTypeList.forEach((dictType, index) => {
    dicts[dictType] = list[index];
  });
}

function getDictNameByValue(dictType: string, value: string | number): ComputedRef<string> {
  return computed(() => {
    const dictList = dicts[dictType];
    if (!dictList) {
      return '';
    }
    const dictItem = dictList.find(item => item.value === value);
    if (!dictItem) {
      return '';
    }
    return dictItem.label;
  });
}

function useDicts(dictTypes: string[]) {
  getDicts(dictTypes);

  return {
    dicts,
    getDictNameByValue
  };
}

export { useDicts };
