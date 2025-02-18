/** Component list, register here to setting it in the form */
import {
  NCascader,
  NCheckboxGroup,
  NDatePicker,
  NDivider,
  NInput,
  NInputNumber,
  NRadio,
  NRadioGroup,
  NRate,
  NSelect,
  NSwitch,
  NTimePicker,
  NTreeSelect,
  NUpload
} from 'naive-ui';
import type { Component, VNodeProps } from 'vue';

const componentMap = {
  Input: NInput,
  InputNumber: NInputNumber,
  Select: NSelect,
  TreeSelect: NTreeSelect,
  Switch: NSwitch,
  Radio: NRadioGroup,
  Checkbox: NCheckboxGroup,
  Cascader: NCascader,
  Rate: NRate,
  DatePicker: NDatePicker,
  TimePicker: NTimePicker,
  Upload: NUpload,
  Divider: NDivider
};

const optionsComponentMap = {
  Radio: NRadio,
  Checkbox: NCheckboxGroup
};

type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

type ExtractPropTypes<T extends Component> = T extends new (...args: any) => any
  ? Writable<Omit<InstanceType<T>['$props'], keyof VNodeProps>>
  : never;

type ComponentMapType = typeof componentMap;
type OptionsComponentMapType = typeof optionsComponentMap;

export type ComponentType = keyof ComponentMapType;
export type OptionsComponentType = Partial<keyof OptionsComponentMapType>;

export type ComponentMapProps = {
  [K in ComponentType]: ExtractPropTypes<ComponentMapType[K]>;
};

export type AllComponentProps = ComponentMapProps[ComponentType];

export { componentMap, optionsComponentMap };
