## 组件概述

ConfigForm 是一个用于配置表单的 Vue 3 组件，支持动态表单生成、验证逻辑以及自定义样式。适用于需要快速构建复杂表单的场景。

组件路径 `src/components/advanced/config-form/config-form.vue`

主要功能：
- 支持动态生成表单项。
- 支持验证逻辑，支持自定义验证规则。
- 支持自定义表单组件。
- 支持自定义表单组件属性，支持自定义组件属性。
- 支持自定义表单组件事件，支持自定义组件事件。
- 支持自定义表单组件插槽，支持自定义组件插槽。

## 组件使用方式

以下是一个简单的示例，展示如何使用 ConfigForm 组件。
```vue
<template>
  <div>
      <ConfigForm ref="formRef" v-model:model="model" :fields="formFields">
         <template #status="{ formModel, key }">
            <NSelect :options="options" v-model:value="formModel[key]" />
        </template>
      </ConfigForm>
  </div>
</template>

<script>
import ConfigForm from '@/components/advanced/config-form/config-form.vue';
import { useNaiveForm } from '@/hooks/common/form';

const options = ref([
  {
    label: '选项1',
    value: '1'
  },
  {
    label: '选项2',
    value: '2'
  }
]);

const model = ref({
  name: '',
  status: ''
});

const formFields = useConfigForm<any>(() => ({
  name: {
    key: 'name', 
    label: $t('page.manage.dept.name'),
    type: 'Input',
    required: true, 
    hide: false, 
    props: { 
      maxlength: 20, 
      'show-count': true, 
      placeholder: $t('common.pleaseEnter') + $t('page.manage.dept.name')
      'onUpdate:value': (value: string) => {
        console.log(value);
      }
    }
  },
  status: {
    key: 'status',
    label: $t('page.manage.dept.status'),
    type: 'Select',
    slot: 'status', 
    rules: [
      {
        required: true,
        message: $t('common.pleaseSelect') + $t('page.manage.dept.status'),
        trigger: 'change'
      }
    ],
  },
  roles: {
    key: 'roles',
    label: $t('page.manage.dept.roles'),
    type: 'Radio',
    options: [ 
      {
        label: 'admin',
        value: 'admin'
      },
      {
        label: 'editor',
        value: 'editor'
      }
    ]
  }
}));

const { formRef, validate, restoreValidation } = useNaiveForm();

async function validate() {
  await validate()
}

</script>
```

## ConfigForm Props

| 属性名               | 类型                           | 必填 | 默认值 | 描述                                              |
| -------------------- | ------------------------------ | ---- | ------ | ------------------------------------------------- |
| model               | any                 | 是   | 无     | 表单参数对象                         |
| fields               | ConfigFormType                 | 是   | 无     | 表单配置，动态生成表单项                          |
| span                 | number                         | 否   | 12     | 布局 与 grid传入 span 一致                        |
| labelPlacement       | 'left'/'top'                   | 否   | left   | label 位置                                        |
| labelWidth           | number/string                  | 否   | 0      | label 的宽度 不传入组件内部会自动判断给合理的宽度 |
| requireMarkPlacement | 'left'/'right'/'right-hanging' | 否   | right  | 必填的 * 位置                                     |

其他属性和 NForm一致。

## fields Props
| 属性名   | 类型             | 必填 | 默认值 | 描述                                                                                 |
| -------- | ---------------- | ---- | ------ | ------------------------------------------------------------------------------------ |
| key      | string           | 是   | 无     | 表单字段 key                                                                         |
| label    | string           | 否   | 无     | 表单字段 label                                                                       |
| type     | string           | 是   | 无     | 表单字段类型，对应组件类型 详见 src/components/advanced/config-form/component-map.ts |
| required | boolean          | 否   | false  | 是否必填                                                                             |
| hide     | boolean/function | 否   | false  | 是否隐藏                                                                             |
| props    | object           | 否   | 无     | 组件属性                                                                             |
| rules    | array            | 否   | 无     | 表单字段验证规则                                                                     |
| slot     | string           | 否   | 无     | 自定义插槽名称                                                                       |
| options  | array            | 否   | 无     | 表单字段选项                                                                         |

## 方法

| 事件名            | 参数       | 描述                   |
| ----------------- | ---------- | ---------------------- |
| validate          | () => void | 表单校验事件           |
| restoreValidation | () => void | 表单信息和校验重置事件 |


## 注意

具体使用方式可以参考具体项目内的使用方法
