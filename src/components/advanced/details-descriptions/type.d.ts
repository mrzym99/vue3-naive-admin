export type DetailsDescriptionsProps = {
  data: any;
  fields: DescriptionItem[];
  width?: number | string;
  title?: string;
  column?: number; // 总列数
};

export interface DescriptionItem {
  key: string;
  label: string;
  span?: number;
  render?: (item: DescriptionItem) => string;
  type?: string;
  value?: any;
}

export type DetailsDescriptionsType = Array<DescriptionItem>;
