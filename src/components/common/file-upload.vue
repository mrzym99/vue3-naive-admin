<script setup lang="ts">
import { nextTick, ref, useAttrs, watch } from 'vue';
import { NButton, NModal, NText, NUpload, useMessage } from 'naive-ui';
import { to } from 'await-to-js';
// 更多组件详情 https://advanced-cropper.github.io/vue-advanced-cropper/components/cropper.html#props
import type { CropperResult } from 'vue-advanced-cropper';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui';
import { upload } from '@/service/api';

export type RequestFun = (
  file: File,
  onProgerss?: (e: { percent: number }) => void
) => Promise<App.Service.Response<string>>;

export interface Option {
  requestFunc?: RequestFun;
}

type FileInfo = FileUpload.FileInfo;

interface Props {
  requestFunc?: RequestFun;
  value: FileInfo[];
  size?: number;
  cropper?: boolean | Record<string, any>;
  uploadText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  uploadText: '上传文件',
  size: 0,
  cropper: false,
  requestFunc: upload as any
});

const attrs: any = useAttrs();
const message = useMessage();

function getProps() {
  return { ...attrs, ...props };
}

function getCropperProps() {
  if (!props.cropper || typeof props.cropper === 'boolean') return {};
  return props.cropper;
}

const emit = defineEmits<{
  'update:value': [value: FileInfo[]];
}>();
const fileList = ref<UploadFileInfo[]>([]);

const uploadApi = props.requestFunc || upload;

if (!uploadApi) {
  throw new Error('requestFunc is required');
}

function verifySize(file: File) {
  if (props.size && file.size > props.size * 1024 * 1024) {
    message.error(`文件大小不能超过${props.size}M`);
    return false;
  }
  return true;
}

const accept: string | undefined = attrs.accept ? (attrs.accept as string).replace(/\s/g, '').toLowerCase() : undefined;

function verifyType(file: File) {
  if (!accept) return true;
  const ext = file.name.substring(file.name.lastIndexOf('.'));
  if (!accept.includes(ext)) {
    message.error(`“${file.name}”格式不正确`);
    return false;
  }
  return true;
}

let isChangeFromProps = true;
watch(
  () => props.value,
  val => {
    if (!isChangeFromProps) {
      isChangeFromProps = true;
      return;
    }
    fileList.value = val.map(item => {
      return {
        id: item.id || Math.random().toString(36).substring(2, 9),
        url: item.url,
        name: item.name,
        status: 'finished'
      };
    });
    isChangeFromProps = true;
  },
  {
    immediate: true,
    deep: true
  }
);

function handleBeforeUpload({ file }: { file: UploadFileInfo }) {
  if (!file.file) return false;
  if (!verifyType(file.file)) return false;
  if (!verifySize(file.file)) return false;

  if (props.cropper) {
    handleCropperInit(file);
    return false;
  }

  return true;
}

const cropperRef = ref<any>(null);
const showCropper = ref(false);
const cropperUrl = ref('');
const cropperLoading = ref(false);
const currentCropperFile = ref<UploadFileInfo | null>(null);
const currentBlob = ref<Blob | null>(null);
function handleCropperInit(file: UploadFileInfo) {
  currentCropperFile.value = file;
  cropperUrl.value = URL.createObjectURL(file.file as File);
  showCropper.value = true;
}

async function blobUrlToBlob(blobUrl: string): Promise<Blob | null> {
  try {
    const response = await fetch(blobUrl);
    if (!response.ok) {
      console.error('Failed to fetch the blob:', response.statusText);
      return null;
    }
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error converting blob URL to Blob:', error);
    return null;
  }
}

function handleChange(res: CropperResult) {
  const { image } = res;
  const blobUrl = image!.src;

  if (!blobUrl) return;
  // 将 Blob URL 转换为 Blob 对象
  blobUrlToBlob(blobUrl).then(blob => {
    if (blob) {
      currentBlob.value = blob;
    }
  });
}

async function handleConfirmCropper() {
  if (!uploadApi) {
    throw new Error('requestFunc is required');
  }

  if (!currentCropperFile.value || !currentBlob.value) return false;
  const file = new File([currentBlob.value], currentCropperFile.value.name, {
    type: currentCropperFile.value.type as string
  });

  if (!verifySize(file)) return false;
  cropperLoading.value = true;
  const [err, res] = await to(uploadApi(file));
  cropperLoading.value = false;
  if (err) {
    return false;
  }
  currentCropperFile.value.file = file;
  currentCropperFile.value.url = res.data;
  currentCropperFile.value.status = 'finished';
  fileList.value.push(currentCropperFile.value);
  nextTick(() => handleFileListChange());
  return true;
}

function handleCloseCropper() {
  currentCropperFile.value = null;
  currentBlob.value = null;
  cropperLoading.value = false;
}

async function handleCustomRequest({ file, onError, onFinish, onProgress }: UploadCustomRequestOptions) {
  if (!uploadApi) {
    onError();
    throw new Error('requestFunc is required');
  }
  const [err, res] = await to(uploadApi(file.file as File, onProgress));
  if (err) {
    onError();
    return;
  }
  onFinish();
  nextTick(() => {
    const index = fileList.value.findIndex(item => item.id === file.id);
    fileList.value[index].url = res.data;
    handleFileListChange();
  });
}

function handleRemove({ file }: { file: UploadFileInfo }) {
  const list = fileList.value
    .filter(item => item.id !== file.id && item.status === 'finished')
    .map(item => {
      return {
        id: item.id,
        name: item.name,
        url: item.url as string,
        status: 'finished'
      };
    });
  isChangeFromProps = false;
  emit('update:value', list);
  return true;
}

function handleFileListChange() {
  const uploadFileList = fileList.value
    .filter(item => item.status === 'finished')
    .map(item => {
      return {
        id: item.id,
        name: item.name,
        url: item.url as string,
        status: 'finished'
      };
    });
  isChangeFromProps = false;
  emit('update:value', uploadFileList);
}
</script>

<template>
  <div>
    <NUpload
      v-bind="getProps()"
      v-model:file-list="fileList"
      class="w-full"
      :on-before-upload="handleBeforeUpload"
      :on-remove="handleRemove"
      :custom-request="handleCustomRequest"
    >
      <slot>
        <NButton v-if="getProps()['list-type'] === 'text' || getProps()['listType'] === 'text'">
          {{ uploadText }}
        </NButton>
      </slot>
    </NUpload>
    <div v-if="accept || size" class="mt-[8px]">
      <template v-if="accept">
        支持
        <NText type="info">{{ accept }}</NText>
        格式&nbsp;&nbsp;
      </template>
      <template v-if="size">
        单个文件不超过
        <NText type="info">{{ size }}M</NText>
      </template>
    </div>
    <NModal
      v-model:show="showCropper"
      class="rounded-none !h-100vh !max-w-100vw !w-full"
      preset="dialog"
      title="图片裁剪"
      type="info"
      positive-text="确定"
      negative-text="取消"
      draggable
      :loading="cropperLoading"
      :on-positive-click="handleConfirmCropper"
      :on-close="handleCloseCropper"
      :on-negative-click="handleCloseCropper"
    >
      <div class="grid h-[calc(100vh-120px)] w-full place-content-center">
        <Cropper
          ref="cropperRef"
          class="h-300px w-300px md:h-500px md:w-500px"
          :src="cropperUrl"
          :stencil-props="{
            aspectRatio: 1
          }"
          v-bind="getCropperProps()"
          @change="handleChange"
        ></Cropper>
      </div>
    </NModal>
  </div>
</template>

<style scoped></style>
