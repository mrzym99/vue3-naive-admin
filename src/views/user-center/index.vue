<script setup lang="tsx">
import { ref } from 'vue';
import Info from './modules/info.vue';
import EditInfo from './modules/editInfo.vue';
import EditPassword from './modules/editPassword.vue';

const tab = ref('editInfo');
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-auto">
    <NGrid class="flex-1" cols="1 s:2" x-gap="16" y-gap="16" responsive="screen" item-responsive>
      <NGridItem>
        <NCard :title="$t('page.userCenter.details')" class="h-full w-full overflow-auto">
          <Info />
        </NCard>
      </NGridItem>
      <NGridItem>
        <NCard class="relative h-full w-full overflow-hidden">
          <NTabs v-model:value="tab" class="mb-5" type="line" animated>
            <NTab class="h-full" name="editInfo" :tab="$t('page.userCenter.editInfo')"></NTab>
            <NTab name="editPwn" :tab="$t('page.userCenter.editPwd')"></NTab>
          </NTabs>
          <EditInfo v-if="tab === 'editInfo'" />
          <EditPassword v-else />
        </NCard>
      </NGridItem>
    </NGrid>
  </div>
</template>

<style scoped></style>
