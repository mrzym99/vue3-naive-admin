import type { VNode } from 'vue';

type Recordable<T = any> = Record<string, T>;
type RenderFn<T> = (row: T) => VNode | Array<VNode> | string | null;
type BooleanPredicate<T> = (value: T) => boolean;
type BooleanProp<T> = BooleanPredicate<T> | boolean;

export type DetailsDescriptionsProps<T extends Recordable = any> = {
  data: T;
  fields: DescriptionItem<T>[];
  width?: number | string;
  title?: string;
  column?: number; // 总列数
};

export interface DescriptionItem<T extends Recordable = any> {
  key: keyof T;
  label: string;
  span?: number;
  hide?: BooleanProp<T>;
  render?: RenderFn<T>;
  type?: string;
  value?: any;
}

export type DetailsDescriptionsType<T extends Recordable = any> = Array<DescriptionItem<T>>;
