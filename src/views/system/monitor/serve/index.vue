<script setup lang="tsx">
import { computed, onMounted, reactive, ref } from 'vue';
import { fetchGetServeStat } from '@/service/api';
import { formatSizeUnits } from '@/utils/common';
import { themeVars } from '@/theme/vars';

const cardData = reactive<any>({
  runtime: {
    os: '',
    arch: '',
    nodeVersion: '',
    npmVersion: ''
  },
  disk: { size: 0, used: 0, available: 0 },
  cpu: {
    manufacturer: '',
    brand: '',
    physicalCores: 0,
    model: '',
    speed: 0,
    rawCurrentLoad: 0,
    rawCurrentLoadIdle: 0,
    coresLoad: []
  },
  memory: { total: 0, available: 0, active: 0 }
});

const loading = ref(false);

async function getStat() {
  loading.value = true;
  const { error, data } = await fetchGetServeStat();
  loading.value = false;
  if (!error) {
    Object.assign(cardData, data);
  }
}

const parseDiskPercentage = computed(() => {
  if (cardData.disk.size <= 0) {
    return 0;
  }
  return Math.floor((cardData.disk.used / cardData.disk.size) * 100);
});

const parseMemPercentage = computed(() => {
  if (cardData.memory.total <= 0) {
    return 0;
  }
  return Math.floor((cardData.memory.active / cardData.memory.total) * 100);
});

const parseCpuInfo = computed(() => {
  return `${cardData.cpu.manufacturer} ${cardData.cpu.brand} @ ${cardData.cpu.speed}GHz`;
});

const progressColor = (percentage: number) => {
  if (percentage > 90) {
    return themeVars.colors.error;
  }
  if (percentage > 80) {
    return themeVars.colors.warning;
  }
  return '';
};

const formatPercentage = (used: number, total: number) => {
  if (total <= 0) {
    return 0;
  }
  return Math.floor((used / total) * 100);
};

onMounted(async () => {
  getStat();
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-auto lt-sm:overflow-auto">
    <NGrid x-gap="16" y-gap="16" responsive="screen" item-responsive :class="loading ? 'loading' : ''">
      <NGridItem span="24 m:12">
        <NCard :bordered="false" class="h-full card-wrapper" title="运行环境">
          <NDescriptions size="small" label-placement="left" bordered :column="1">
            <NDescriptionsItem>
              <template #label>操作系统</template>
              {{ cardData.runtime.os }}
            </NDescriptionsItem>
            <NDescriptionsItem>
              <template #label>系统架构</template>
              {{ cardData.runtime.arch }}
            </NDescriptionsItem>
            <NDescriptionsItem>
              <template #label>Node版本</template>
              {{ cardData.runtime.nodeVersion }}
            </NDescriptionsItem>
            <NDescriptionsItem>
              <template #label>Npm版本</template>
              {{ cardData.runtime.npmVersion }}
            </NDescriptionsItem>
          </NDescriptions>
        </NCard>
      </NGridItem>
      <NGridItem span="24 m:12">
        <NCard :bordered="false" class="h-full card-wrapper" title="磁盘">
          <NGrid x-gap="16" y-gap="16" responsive="screen" item-responsive>
            <NGridItem span="24 m:12">
              <NDescriptions size="small" label-placement="left" bordered :column="1">
                <NDescriptionsItem>
                  <template #label>总空间</template>
                  {{ formatSizeUnits(cardData.disk.size) }}
                </NDescriptionsItem>
                <NDescriptionsItem>
                  <template #label>已用空间</template>
                  {{ formatSizeUnits(cardData.disk.used) }}
                </NDescriptionsItem>
                <NDescriptionsItem>
                  <template #label>可用空间</template>
                  {{ formatSizeUnits(cardData.disk.available) }}
                </NDescriptionsItem>
              </NDescriptions>
            </NGridItem>
            <NGridItem span="24 m:12" class="flex-center">
              <NProgress
                :color="progressColor(parseDiskPercentage)"
                type="dashboard"
                gap-position="bottom"
                :percentage="parseDiskPercentage"
              />
            </NGridItem>
          </NGrid>
        </NCard>
      </NGridItem>
      <NGridItem span="24 m:12">
        <NCard :bordered="false" class="h-full card-wrapper" title="CPU">
          <NDescriptions size="small" label-placement="left" bordered :column="1">
            <NDescriptionsItem>
              <template #label>详细</template>
              {{ parseCpuInfo }}
            </NDescriptionsItem>
            <NDescriptionsItem>
              <template #label>负载</template>
              {{ formatSizeUnits(cardData.disk.used) }}
            </NDescriptionsItem>
            <NDescriptionsItem v-for="(item, index) in cardData.cpu.coresLoad" :key="index">
              <template #label>{{ `核心${index + 1} 负载` }}</template>
              <NProgress
                :percentage="formatPercentage(item.rawLoad, item.rawLoad + item.rawLoadIdle)"
                :color="progressColor(formatPercentage(item.rawLoad, item.rawLoad + item.rawLoadIdle))"
              />
            </NDescriptionsItem>
          </NDescriptions>
        </NCard>
      </NGridItem>
      <NGridItem span="24 m:12">
        <NCard :bordered="false" class="h-full card-wrapper" title="memory">
          <NGrid x-gap="16" y-gap="16" responsive="screen" item-responsive>
            <NGridItem span="24 m:12">
              <NDescriptions size="small" label-placement="left" bordered :column="1">
                <NDescriptionsItem>
                  <template #label>总内存</template>
                  {{ formatSizeUnits(cardData.memory.total) }}
                </NDescriptionsItem>
                <NDescriptionsItem>
                  <template #label>已用内存</template>
                  {{ formatSizeUnits(cardData.memory.active) }}
                </NDescriptionsItem>
                <NDescriptionsItem>
                  <template #label>可用内存</template>
                  {{ formatSizeUnits(cardData.memory.available) }}
                </NDescriptionsItem>
              </NDescriptions>
            </NGridItem>
            <NGridItem span="24 m:12" class="flex-center">
              <NProgress
                :color="progressColor(parseMemPercentage)"
                type="dashboard"
                gap-position="bottom"
                :percentage="parseMemPercentage"
              />
            </NGridItem>
          </NGrid>
        </NCard>
      </NGridItem>
    </NGrid>
  </div>
</template>

<style scoped></style>
