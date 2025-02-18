<script setup lang="ts">
import type { Component } from 'vue';
import type { Option } from './type';

defineOptions({
  name: 'RenderOptions'
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
