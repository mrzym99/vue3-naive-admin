<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useAuthStore } from '@/store/modules/auth';

import { fetchGetNoticeCount } from '@/service/api';

defineOptions({
  name: 'HeaderBanner'
});

const appStore = useAppStore();
const authStore = useAuthStore();

const gap = computed(() => (appStore.isMobile ? 0 : 16));

interface StatisticData {
  id: number;
  label: string;
  value: number;
}

const statisticData = ref<StatisticData[]>([
  {
    id: 0,
    label: $t('page.home.noticeCount'),
    value: 0
  }
  // {
  //   id: 1,
  //   label: $t('page.home.todo'),
  //   value: '1/3'
  // },
  // {
  //   id: 2,
  //   label: $t('page.home.message'),
  //   value: '8'
  // }
]);

function getNoticeCount() {
  fetchGetNoticeCount().then(res => {
    statisticData.value[0].value = res.data;
  });
}

onMounted(() => {
  getNoticeCount();
});
</script>

<template>
  <NCard :bordered="false" class="card-wrapper">
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:18">
        <div class="flex-y-center">
          <NAvatar :src="authStore.userInfo.avatar" :size="72" round>
            <template #fallback>
              <SvgIcon icon="ph:user-circle" class="h-72px w-72px" />
            </template>
          </NAvatar>
          <div class="flex-1 pl-12px">
            <h3 class="text-18px font-semibold">
              {{ $t('page.home.greeting', { nickName: authStore.userInfo.nickName }) }}
            </h3>
          </div>
        </div>
      </NGi>
      <NGi span="24 s:24 m:6">
        <NSpace :size="24" justify="end">
          <NStatistic v-for="item in statisticData" :key="item.id" class="whitespace-nowrap" v-bind="item" />
        </NSpace>
      </NGi>
    </NGrid>
  </NCard>
</template>

<style scoped></style>
