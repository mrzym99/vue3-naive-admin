<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

const publicPath = import.meta.env.VITE_BASE_URL || '/';
const baseUrl = `${publicPath}tinymce-resource`;

defineOptions({
  name: 'TinymcePreview'
});

const props = defineProps<{
  content: string;
}>();

const iframeRef = ref<HTMLIFrameElement>();

const iframeUrl = computed(() => {
  if (!props.content) return '';

  return `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              /* 引入 TinyMCE 默认样式 */
              @import '${baseUrl}/tinymce/skins/ui/oxide/content.min.css';
              @import '${baseUrl}/tinymce/skins/content/default/content.min.css';
            </style>
          </head>
          <body>
            ${props.content}
          </body>
        </html>
      `;
});

const updateIframeHeight = () => {
  if (iframeRef.value) {
    // 获取内容文档的实际高度
    const contentHeight = iframeRef.value.contentDocument?.body.scrollHeight;
    if (contentHeight) {
      iframeRef.value.style.height = `${contentHeight + 60}px`; // +10px 缓冲
    }
  }
};

// 使用 ResizeObserver 监听内容尺寸变化
const observer = new ResizeObserver(updateIframeHeight);

onMounted(() => {
  // iframe 加载完成后首次计算
  iframeRef.value?.addEventListener('load', updateIframeHeight);

  // 监听内容区域 DOM 变化
  if (iframeRef.value?.contentDocument?.body) {
    observer.observe(iframeRef.value.contentDocument.body);
  }
});
</script>

<template>
  <iframe ref="iframeRef" class="w-full" :srcdoc="iframeUrl" frameborder="0"></iframe>
</template>
