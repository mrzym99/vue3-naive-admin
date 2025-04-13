<script lang="ts" setup>
import { computed } from 'vue';

defineOptions({
  name: 'TinymcePreview'
});

const props = defineProps<{
  content: string;
}>();

const iframeUrl = computed(() => {
  if (!props.content) return '';

  return `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              /* 引入 TinyMCE 默认样式 */
              @import 'tinymce/skins/ui/oxide/content.min.css';
              @import 'tinymce/skins/content/default/content.min.css';
            </style>
          </head>
          <body>
            ${props.content}
          </body>
        </html>
      `;
});
</script>

<template>
  <iframe class="w-full" :srcdoc="iframeUrl" frameborder="0"></iframe>
</template>
