<script setup lang="ts">
import type { Component } from 'vue';
import type { Option } from './config-form-type';

defineOptions({
  name: 'ConfigFormItemOptions'
});

defineProps<{
  componentId: Component;
  options: Option<string | number>[];
}>();
</script>

<template>
  <component
    :is="componentId"
    v-for="item in options"
    :key="item.value"
    :label="item.label"
    :value="item.value"
  ></component>
</template>
