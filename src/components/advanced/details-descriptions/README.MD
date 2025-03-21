## 组件概述

DetailsDescriptions 是一个用于配置详情描述的 Vue 3 组件，支持动态详情描述生成。适用于需要快速构建复杂详情描述的场景。

组件路径 `src/components/advanced/details-descriptions/details-descriptions.vue`

主要功能：
- 支持动态生成详情描述。
- 支持详情项自定义render函数。
- 响应式布局

## 组件使用方式

以下是一个简单的示例，展示如何使用 DetailsDescriptions 组件。
```vue
<template>
  <div>
     <DetailsDescriptions
      v-model:visible="modelVisible"
      title="详情"
      width="60%"
      :fields="detailColumns"
      :data="detailData"
    />
  </div>
</template>

<script>
import DetailsDescriptions from '@/components/advanced/details-descriptions/details-descriptions.vue';

const modelVisible = ref(false); 

const detailData = ref({
  username: '1111',
  status: 1
});

const detailColumns = useDetailDescriptions<any>(() => [
  {
    key: 'username',
    label: $t('page.manage.user.username')
  },
  {
    key: 'status',
    label: $t('common.status'),
    render: row => {
      return (
        <NTag>
          {row.status === 1 ? $t('common.enable') : $t('common.disable')}
        </NTag>
      );
    }
  },
]);

</script>
```

## DetailsDescriptions Props

| 属性名               | 类型                           | 必填 | 默认值 | 描述                              |
| -------------------- | ------------------------------ | ---- | ------ | ------------------------------ |
| data               | object                 | 是   | 无     | 详情数据对象                          |
| fields               | DetailsDescriptionsType                 | 是   | 无     | 详情项配置，动态生成详情项              |
| width           | number/string                  | 否   | Naive UI 预设     | 弹窗的宽度|
| title           | number/string                  | 否   | '详情'     | 弹窗的标题|
| column           | number                  | 否   | 2      | 详情分为几列 参考 Naive Ui NDescriptions 组件|

其他属性和 NDescriptions 一致。

## fields Props
| 属性名   | 类型             | 必填 | 默认值 | 描述                                          |
| -------- | ---------------- | ---- | ------ | --------------------------------------------- |
| key      | string           | 是   | 无     | 表单字段 key                                  |
| label    | string           | 否   | 无     | 表单字段 label                                |
| hide     | boolean/function | 否   | false  | 是否隐藏                                      |
| render    | function         | 否   | 无     | 自定义render函数                              |
| value    | any              | 否   | 无     | 表单字段值                                    |


## 注意

具体使用方式可以参考具体项目内的使用方法
