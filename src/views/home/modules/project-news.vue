<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';

defineOptions({
  name: 'ProjectNews'
});

interface NewsItem {
  id: number;
  content: string;
  time: string;
}

const newses = computed<NewsItem[]>(() => [
  { id: 1, content: $t('page.home.projectNews.desc1'), time: '2024-12-24 20:12:22' },
  { id: 2, content: $t('page.home.projectNews.desc2'), time: '2024-12-24 22:24:54' },
  { id: 3, content: $t('page.home.projectNews.desc3'), time: '2025-03-02 22:43:12' },
  { id: 4, content: $t('page.home.projectNews.desc4'), time: '2025-03-02 23:33:31' },
  { id: 4, content: $t('page.home.projectNews.desc5'), time: '2025-03-13 22:33:31' },
  { id: 4, content: $t('page.home.projectNews.desc6'), time: '2025-03-13 00:02:31' }
]);
</script>

<template>
  <NCard :title="$t('page.home.projectNews.title')" :bordered="false" size="small" segmented class="card-wrapper">
    <template #header-extra>
      <a class="text-primary" href="javascript:;">{{ $t('page.home.projectNews.moreNews') }}</a>
    </template>
    <NList>
      <NListItem v-for="item in newses" :key="item.id">
        <template #prefix>
          <AdminAvatar class="size-48px!" />
        </template>
        <NThing :title="item.content" :description="item.time" />
      </NListItem>
    </NList>
  </NCard>
</template>

<style scoped></style>
