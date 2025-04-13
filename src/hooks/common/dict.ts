import { reactive } from 'vue';
import { fetchGetDictItemListByCode } from '@/service/api';

export type Dicts = {
  [key: string]: Option<string | number>[];
};

export type Option<K = number | string> = {
  value: K;
  label: string;
  disabled?: boolean;
  key?: number | string;
  isLeaf?: boolean;
  children?: Option<K>[];
};

function useDicts(dictTypes: string[] | string) {
  const dicts: Dicts = reactive({});

  async function getDicts(): Promise<void> {
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
          value: formateValue(item.value)
        }));
      })
    );

    dictTypeList.forEach((dictType, index) => {
      dicts[dictType] = list[index];
    });
  }

  function formateValue(value: string | number): number | string {
    // 检查 value 是否为数字字符串
    if (typeof value === 'number') {
      return value;
    }
    return /^\d+$/.test(value) ? Number(value) : value;
  }

  function getDictNameByValue(dictType: string, value: string | number): string {
    const dictList = dicts[dictType];
    if (!dictList) {
      return '';
    }
    const dictItem = dictList.find(item => item.value === value);
    if (!dictItem) {
      return '';
    }
    return dictItem.label;
  }

  getDicts();

  return {
    dicts,
    getDictNameByValue
  };
}

export { useDicts };
