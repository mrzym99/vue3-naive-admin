<script setup lang="ts">
import { onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import { $t } from '@/locales';

import { fetchGetNoticeList } from '@/service/api';

defineOptions({
  name: 'Notice'
});

const noticeList = ref<Api.SystemManage.Notice[]>([]);

async function getNoticeList() {
  const { error, data } = await fetchGetNoticeList({
    currentPage: 1,
    pageSize: 99
  });
  if (!error) {
    noticeList.value = data.list;
  }
}

onMounted(() => {
  getNoticeList();
});
</script>

<template>
  <NCard :title="$t('page.home.notice')" :bordered="false" size="small" segmented class="card-wrapper">
    <NList>
      <NListItem v-for="(item, index) in noticeList" :key="item.id">
        <NThing>
          <template #header>
            <span class="detail-link">{{ item.name }}</span>
            <NTag class="ml-3" :type="item.type === 1 ? 'success' : 'warning'">
              {{ item.type === 1 ? '公告' : '通知' }}
            </NTag>
          </template>
          {{ dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
          <TinymcePreview :class="index < noticeList.length - 1 ? '' : 'min-h-55vh'" :content="item.content" />
        </NThing>
      </NListItem>
    </NList>
  </NCard>
</template>

<style scoped></style>
