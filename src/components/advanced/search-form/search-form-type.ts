import type { ConfigFormArrayType } from '../config-form/config-form-type';

export type Recordable<T = any> = Record<string, T>;
export type SearchFormType<T extends Recordable = Recordable> = ConfigFormArrayType<T> | (() => ConfigFormArrayType<T>);
export type SearchFormArrayType<T extends Recordable = Recordable> = ConfigFormArrayType<T>;
