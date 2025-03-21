## 组件概述

SearchForm 是一个用于配置搜索框的 Vue 3 组件，支持动态搜索框生成。响应式布局。

组件路径 `src/components/advanced/search-form/search-form.vue`

主要功能：
- 支持动态生成表单项。
- 支持自定义表单组件。
- 支持自定义表单组件属性，支持自定义组件属性。
- 支持自定义表单组件事件，支持自定义组件事件。
- 支持自定义表单组件插槽，支持自定义组件插槽。

## 组件使用方式

以下是一个简单的示例，展示如何使用 SearchForm 组件。
```vue
<template>
  <div>
    <SearchForm
      v-model:model="searchParams"
      :fields="searchForm"
      @search="search"
      @reset="reset"
      >
        <template #status="{ formModel, key }">
          <NSelect :options="options" v-model:value="formModel[key]" />
        </template>
      </SearchForm>
  </div>
</template>

<script>
import SearchForm from '@/components/advanced/search-form/search-form.vue';


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

const searchParams = ref({
  name: '',
  status: ''
});

const searchForm = useSearchForm<any>(() => [
  {
    key: 'name',
    label: $t('page.manage.dept.name'),
    type: 'Input',
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.dept.name')
    }
  },
  {
    key: 'status',
    label: $t('page.manage.dept.status'),
    type: 'Select',
    slot: 'status', 
  }
]);

function search() {
  console.log(searchParams.value);
}

function reset() {
  console.log('reset');
}

</script>
```

## SearchForm Props

| 属性名               | 类型                           | 必填 | 默认值 | 描述                                              |
| -------------------- | ------------------------------ | ---- | ------ | ------------------------------------------------- |
| model               | any                 | 是   | 无     | 搜索参数对象                          |
| fields               | SearchFormType                 | 是   | 无     | 表单配置，动态生成表单项                          |
| labelWidth           | number/string                  | 否   | 0      | label 的宽度 不传入组件内部会自动判断给合理的宽度 |

其他属性和 NForm一致。

## fields Props
| 属性名   | 类型             | 必填 | 默认值 | 描述                                                                                 |
| -------- | ---------------- | ---- | ------ | ------------------------------------------------------------------------------------ |
| key      | string           | 是   | 无     | 表单字段 key                                                                         |
| label    | string           | 否   | 无     | 表单字段 label                                                                       |
| type     | string           | 是   | 无     | 表单字段类型，对应组件类型 详见 src/components/advanced/config-form/component-map.ts |
| hide     | boolean/function | 否   | false  | 是否隐藏                                                                             |
| props    | object           | 否   | 无     | 组件属性                                                                             |
| slot     | string           | 否   | 无     | 自定义插槽名称                                                                       |
| options  | array            | 否   | 无     | 表单字段选项                                                                         |

## 事件

| 事件名            | 参数       | 描述                   |
| ----------------- | ---------- | ---------------------- |
| search | () => void | 搜索 |
| reset | () => void | 重置 |


## 注意

具体使用方式可以参考具体项目内的使用方法

