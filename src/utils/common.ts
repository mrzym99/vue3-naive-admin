import type { CascaderOption } from 'naive-ui';
import { $t } from '@/locales';

/**
 * Transform record to option
 *
 * @example
 *   ```ts
 *   const record = {
 *     key1: 'label1',
 *     key2: 'label2'
 *   };
 *   const options = transformRecordToOption(record);
 *   // [
 *   //   { value: 'key1', label: 'label1' },
 *   //   { value: 'key2', label: 'label2' }
 *   // ]
 *   ```;
 *
 * @param record
 */
export function transformRecordToOption<T extends Record<string, string>>(record: T) {
  return Object.entries(record).map(([value, label]) => ({
    value,
    label
  })) as CommonType.Option<keyof T>[];
}

export function transLateRecordToOption<T extends Record<string, string>>(record: T, valueToString?: boolean) {
  return Object.entries(record).map(([value, label]) => ({
    value: valueToString ? String(value) : Number(value),
    label: $t(label as App.I18n.I18nKey)
  })) as CommonType.Option<keyof T>[];
}

/**
 * Translate options
 *
 * @param options
 */
export function translateOptions(options: CommonType.Option<string>[]) {
  return options.map(option => ({
    ...option,
    label: $t(option.label as App.I18n.I18nKey)
  }));
}

/**
 * Toggle html class
 *
 * @param className
 */
export function toggleHtmlClass(className: string) {
  function add() {
    document.documentElement.classList.add(className);
  }

  function remove() {
    document.documentElement.classList.remove(className);
  }

  return {
    add,
    remove
  };
}

export function generatePrefix(prefix: string, perm: string) {
  return prefix ? `${prefix.replace(/\{:}+/, ':')}:${perm}` : perm;
}

/**
 * @param bytes 字节
 * @param decimals 小数位数
 */
export function formatSizeUnits(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

/**
 * 对树进行扁平化
 *
 * @param tree
 */
export function flatTreeData<T>(tree: T[], child: keyof T = 'children' as keyof T): T[] {
  return tree.reduce((prev, cur) => {
    // 将当前节点添加到结果中
    const result = [...prev, cur];

    // 如果当前节点有子节点，则递归处理子节点
    if (cur[child] && Array.isArray(cur[child])) {
      return result.concat(flatTreeData(cur[child] as T[], child));
    }

    return result;
  }, [] as T[]);
}

export function str2tree(str: string, treeData: CascaderOption[] = [], separator: string = ':') {
  return str.split(separator).reduce((prev, curr, currentIndex, arr): any => {
    // 构造当前路径
    const value = arr.slice(0, currentIndex + 1).join(separator);

    // 在当前层级中查找是否存在该路径的节点
    const index = prev.findIndex(item => item.value === value);

    if (index !== -1) {
      // 如果存在，直接返回该节点的子节点数组
      // 确保 children 是一个数组，如果 children 是 undefined，则初始化为 []
      return prev[index].children || [];
    }

    // 如果不存在，创建一个新的节点
    const item: CascaderOption = {
      value,
      label: curr,
      children: []
    };
    if (currentIndex === arr.length - 1) delete item.children;
    // 将新节点添加到当前层级
    prev.push(item);

    // 返回新节点的子节点数组，用于下一次迭代
    return item.children;
  }, treeData);
}
