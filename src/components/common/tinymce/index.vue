<script setup lang="ts">
import { computed } from 'vue';
import EditorComp from '@tinymce/tinymce-vue';
import tinymceUrl from 'tinymce/tinymce.min.js?url';
import './plugins';
import type { RawEditorOptions } from 'tinymce';

import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { type TinymceEvents, tinymceProps } from './props';
import langs from './langs/';

defineEmits<TinymceEvents>();
const props = defineProps(tinymceProps);

const modelValue = defineModel<string>('value');

const langName = computed<any>(() => {
  const appStore = useAppStore();
  const lang = appStore.locale;
  return ['zh_CN', 'en'].includes(lang) ? lang : 'zh_CN';
});

const skinName = computed(() => {
  const themeStore = useThemeStore();
  return themeStore.darkMode ? 'oxide-dark' : 'oxide';
});

const initOptions = computed((): RawEditorOptions => {
  const { height, init, toolbar, plugins } = props;
  const publicPath = import.meta.env.VITE_BASE_URL || '/';
  const baseUrl = `${publicPath}tinymce-resource`;

  return {
    base_url: baseUrl,
    license_key: 'gpl',
    height,
    toolbar,
    menubar: 'file edit insert view format table',
    plugins,
    language_url: langs[langName.value],
    language: langName.value,
    branding: false,
    default_link_target: '_blank',
    link_title: false,
    promotion: false,
    object_resizing: false,
    auto_focus: true,
    resize: true,
    skin: skinName.value,
    skin_url: `${baseUrl}/skins/ui/${skinName.value}`,
    ...init
  };
});
</script>

<template>
  <EditorComp
    v-bind="{ ...$attrs, ...props }"
    v-model="modelValue"
    :tinymce-script-src="tinymceUrl"
    :init="initOptions"
  />
</template>

<style scoped></style>
