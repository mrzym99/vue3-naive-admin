import type { FormItemRule } from 'naive-ui';
import type { ComponentType } from './component-map';

type returnBoolean = () => boolean;

export interface ConfigForm {
  key: string;
  label: string;
  type: ComponentType;
  hide?: returnBoolean | boolean;
  span?: number;
  disabled?: returnBoolean | boolean;
  required?: returnBoolean | boolean;
  options?: Option<string | number>[];
  props?: Record<string, any>;
  rules?: FormItemRule;
}

export type ConfigFormType = Array<ConfigForm>;

export type Option<K = string> = {
  value: K;
  label: string;
  disabled?: boolean;
  key?: string;
  isLeaf?: boolean;
  children?: Option<K>[];
};
