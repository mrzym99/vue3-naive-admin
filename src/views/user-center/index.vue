<script setup lang="tsx">
import { ref } from 'vue';
import Info from './modules/info.vue';
import EditInfo from './modules/editInfo.vue';
import EditPassword from './modules/editPassword.vue';

const tab = ref('editInfo');
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <div class="flex sm:flex-1-hidden card-wrapper">
      <NCard :title="$t('page.userCenter.details')" class="h-full w-45% overflow-auto">
        <Info />
      </NCard>
      <NCard class="relative ml-[16px] h-full flex-1 overflow-hidden">
        <NTabs v-model:value="tab" class="mb-5" type="line" animated>
          <NTab class="h-full" name="editInfo" :tab="$t('page.userCenter.editInfo')"></NTab>
          <NTab name="editPwn" :tab="$t('page.userCenter.editPwd')"></NTab>
        </NTabs>
        <EditInfo v-if="tab === 'editInfo'" class="h-[calc(100%-130px)] overflow-auto" />
        <EditPassword v-else />
      </NCard>
    </div>
  </div>
</template>

<style scoped></style>
