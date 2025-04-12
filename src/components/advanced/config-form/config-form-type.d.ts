import type { FormItemRule } from 'naive-ui';
import type { ComponentType } from './component-map';

type Recordable<T = any> = Record<string, T>;
type BooleanPredicate<T> = (value: T) => boolean;
// 定义一个通用的布尔类型或函数类型
type BooleanProp<T> = BooleanPredicate<T> | boolean;

export type Option<K = number | string> = {
  value: K;
  label: string;
  disabled?: boolean;
  key?: number | string;
  isLeaf?: boolean;
  children?: Option<K>[];
};

/** 获取所有字段名 */
export type FieldKeys<T> = Exclude<keyof T, symbol | number>;

export interface ConfigFormItem<T extends Recordable> {
  key: FieldKeys<T>;
  label: string;
  type: ComponentType;
  hide?: BooleanProp<T>;
  span?: number;
  slot?: string;
  disabled?: BooleanProp<T>;
  required?: BooleanProp<T>;
  options?: Option<string | number>[];
  props?: Recordable;
  rules?: FormItemRule[];
}

export type ConfigFormArrayType<T extends Recordable = Recordable> = Array<ConfigFormItem<T>>;

export type ConfigFormObjectType<T extends Recordable = Recordable> = {
  [K in FieldKeys<T>]?: ConfigFormItem<T>;
};

export type ConfigFormType<T extends Recordable = Recordable> =
  | ConfigFormObjectType<T>
  | (() => ConfigFormObjectType<T>);
