import type { FormItemRule } from 'naive-ui';
import type { ComponentType } from './component-map';

export interface ConfigForm {
  key: string;
  label: string;
  type: ComponentType;
  hide?: boolean;
  span?: number;
  disabled?: boolean;
  required?: boolean;
  options?: Option<string | number>[];
  props?: Record<string, any>;
  rules?: FormItemRule;
}

export type ConfigFormType = Array<ConfigForm>;

export type Option<K = string> = { value: K; label: string; disabled?: boolean; key?: string; children?: Option<K>[] };
