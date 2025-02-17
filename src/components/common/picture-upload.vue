<script setup lang="ts">
import type { UploadFileInfo } from 'naive-ui';
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';

defineComponent({
  name: 'PictureUpload'
});

// interface Props{
//     defaultUpload: boolean;
//     fileList: UploadFileInfo[];
// }

// const props = defineProps({
//   defaultUpload: {
//     type: Boolean,
//     default: false
//   }
// });

const fileList = defineModel('fileList', {
  type: Array as PropType<UploadFileInfo[]>,
  default: () => []
});

const showModal = ref(false);
const previewImageUrl = ref('');
function handlePreview(file: UploadFileInfo) {
  const { url } = file;
  previewImageUrl.value = url as string;
  showModal.value = true;
}
</script>

<template>
  <NUpload
    action="#"
    :file-list="fileList"
    list-type="image-card"
    :default-upload="false"
    v-bind="$attrs"
    @change="file => console.log(file)"
    @remove="file => console.log(file)"
    @preview="handlePreview"
  />
  <NModal v-model:show="showModal" preset="card" style="width: 600px" title="一张很酷的图片">
    <img :src="previewImageUrl" style="width: 100%" />
  </NModal>
</template>
