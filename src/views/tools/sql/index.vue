<script setup lang="ts">
import { ref } from 'vue';
import type { UploadFileInfo } from 'naive-ui';
import { downloadSql, importSql } from '@/service/api/tool/sql';
import { $t } from '@/locales';
const show = ref(false);
const width = ref('600px');
const fileList = ref<UploadFileInfo[]>([]);

function beforeUpload({ file }: { file: UploadFileInfo }) {
  const isSql = file.name.endsWith('.sql');
  if (!isSql) {
    window?.$message?.error($t('page.tools.sql.importFileTypeTip'));
  }
  return isSql;
}

async function handleSubmit() {
  if (fileList.value.length === 0) {
    window?.$message?.error($t('page.tools.sql.importFileTypeTip'));
    return;
  }
  const { error } = await importSql(fileList.value[0].file as File);
  if (!error) {
    window?.$message?.success($t('page.tools.sql.importSuccess'));
    show.value = false;
    fileList.value = [];
  }
}

function handleCancel() {
  show.value = false;
  fileList.value = [];
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden">
    <NCard :bordered="false" size="small" class="flex-1 card-wrapper">
      <div class="w-60% lt-sm:w-100%">
        <NAlert type="warning">
          {{ $t('page.tools.sql.exportTip') }}
        </NAlert>
        <NButton class="mt-2" type="success" @click="downloadSql">{{ $t('page.tools.sql.export') }}</NButton>
      </div>
      <div class="mt-2rem w-60% lt-sm:w-100%">
        <NAlert type="warning">
          {{ $t('page.tools.sql.importWarningTip') }}
          <br />
          {{ $t('page.tools.sql.importDangerTip') }}
        </NAlert>
        <NButton class="mt-2" type="warning" @click="show = true">{{ $t('page.tools.sql.import') }}</NButton>
      </div>

      <NModal
        v-model:show="show"
        :positive-text="$t('common.confirm')"
        :negative-text="$t('common.cancel')"
        preset="dialog"
        :title="$t('page.tools.sql.import')"
        :width="width"
        :mask-closable="false"
        @positive-click="handleSubmit"
        @negative-click="handleCancel"
      >
        <NForm>
          <NFormItem path="sql">
            <NUpload v-model:file-list="fileList" :default-upload="false" :max="1" @before-upload="beforeUpload">
              <NButton>{{ $t('page.tools.sql.importFilePlaceholder') }}</NButton>
            </NUpload>
          </NFormItem>
        </NForm>
      </NModal>
    </NCard>
  </div>
</template>
