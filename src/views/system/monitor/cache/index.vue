<script setup lang="tsx">
import { NButton, NPopconfirm } from 'naive-ui';
import { onMounted, ref } from 'vue';
import {
  fetchDeleteCacheByKey,
  fetchDeletePrefix,
  fetchGetCacheList,
  fetchGetCacheValueByKey,
  fetchGetKeysByPrefix
} from '@/service/api';
import { $t } from '@/locales';
import { useAuth } from '@/hooks/business/auth';

const { hasAuth } = useAuth();
const cacheLoading = ref(false);
const keyLoading = ref(false);
const detailLoading = ref(false);
const currentCachePrefix = ref('');
const cacheListData = ref<Api.SystemManage.CachePrefix[]>([]);
const cacheListColumns = [
  {
    title: () => $t('page.manage.cache.name'),
    key: 'name'
  },
  {
    title: () => $t('page.manage.cache.prefix'),
    key: 'prefix'
  },
  {
    title: () => $t('common.operate'),
    key: 'operation',
    width: 80,
    render: (row: Api.SystemManage.CachePrefix) => {
      return (
        <NPopconfirm onPositiveClick={() => deleteCachePrefix(row.prefix)}>
          {{
            default: () => $t('common.confirmDelete'),
            trigger: () => (
              <NButton disabled={!hasAuth('system:cache:delete')} type="error" ghost size="small">
                {$t('common.delete')}
              </NButton>
            )
          }}
        </NPopconfirm>
      );
    }
  }
];

type KeyItem = {
  key: string;
};

const keyListData = ref<KeyItem[]>([]);
const keyListColumns = [
  {
    title: () => $t('page.manage.cache.key'),
    key: 'key',
    ellipsis: {
      tooltip: {
        contentStyle: {
          maxWidth: '300px'
        }
      }
    }
  },
  {
    title: () => $t('common.operate'),
    key: 'operation',
    width: 80,
    render: (row: KeyItem) => {
      return (
        <NPopconfirm onPositiveClick={() => deleteKey(row.key)}>
          {{
            default: () => $t('common.confirmDelete'),
            trigger: () => (
              <NButton disabled={!hasAuth('system:cache:delete')} type="error" ghost size="small">
                {$t('common.delete')}
              </NButton>
            )
          }}
        </NPopconfirm>
      );
    }
  }
];

const cacheDetail = ref({
  name: '',
  key: '',
  value: ''
});

async function getCachePrefixList() {
  cacheLoading.value = true;
  const { error, data } = await fetchGetCacheList();
  cacheLoading.value = false;
  if (!error) {
    cacheListData.value = data;
  }
}

function handlePrefixRowClick(row: Api.SystemManage.CachePrefix) {
  return {
    style: 'cursor: pointer;',
    onClick: () => {
      currentCachePrefix.value = row.prefix;
      getCacheKeysByPrefix(row.prefix);
      cacheDetail.value = {
        name: '',
        key: '',
        value: ''
      };
    }
  };
}

async function getCacheKeysByPrefix(prefix: string) {
  keyLoading.value = true;
  const { error, data } = await fetchGetKeysByPrefix(prefix);
  keyLoading.value = false;
  if (!error) {
    keyListData.value = data.map(v => ({
      key: v
    }));
  }
}

function handleKeyRowClick(row: KeyItem) {
  return {
    style: 'cursor: pointer;',
    onClick: () => {
      getCacheDetail(row.key);
    }
  };
}

async function getCacheDetail(key: string) {
  detailLoading.value = true;
  const { error, data } = await fetchGetCacheValueByKey(key);
  if (!error) {
    detailLoading.value = false;
    cacheDetail.value = {
      name: currentCachePrefix.value,
      key,
      value: data
    };
  }
}

async function deleteCachePrefix(prefix: string) {
  const { error } = await fetchDeletePrefix(prefix);
  if (!error) {
    window.$message?.success($t('common.deleteSuccess'));
    getCachePrefixList();
    keyListData.value = [];
    currentCachePrefix.value = '';
    cacheDetail.value = {
      name: '',
      key: '',
      value: ''
    };
  }
}

async function deleteKey(key: string) {
  // 删除操作
  const { error } = await fetchDeleteCacheByKey(key);
  if (!error) {
    window.$message?.success($t('common.deleteSuccess'));
    getCacheKeysByPrefix(currentCachePrefix.value);
    cacheDetail.value = {
      name: '',
      key: '',
      value: ''
    };
  }
}

onMounted(async () => {
  getCachePrefixList();
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-auto lt-sm:overflow-auto">
    <NGrid class="h-full" x-gap="16" y-gap="16" responsive="screen" item-responsive>
      <NGridItem span="24 m:8">
        <NCard :bordered="false" class="h-full card-wrapper" :title="$t('page.manage.cache.list')">
          <NDataTable
            :loading="cacheLoading"
            :row-props="handlePrefixRowClick"
            :columns="cacheListColumns"
            :data="cacheListData"
            max-height="calc(100vh - 20rem)"
            :bordered="false"
          />
        </NCard>
      </NGridItem>
      <NGridItem span="24 m:8">
        <NCard :bordered="false" class="h-full card-wrapper" :title="$t('page.manage.cache.keyList')">
          <NDataTable
            :loading="keyLoading"
            max-height="calc(100vh - 20rem)"
            :row-props="handleKeyRowClick"
            :columns="keyListColumns"
            :data="keyListData"
            :bordered="false"
          />
        </NCard>
      </NGridItem>
      <NGridItem span="24 m:8">
        <NSpin :show="detailLoading">
          <NCard :bordered="false" class="h-full card-wrapper" :title="$t('page.manage.cache.content')">
            <NDescriptions :column="1">
              <NDescriptionsItem :label="$t('page.manage.cache.name')">
                <div class="min-h-2rem">
                  {{ cacheDetail.name }}
                </div>
              </NDescriptionsItem>
              <NDescriptionsItem :label="$t('page.manage.cache.key')">
                <div class="min-h-2rem">
                  {{ cacheDetail.key }}
                </div>
              </NDescriptionsItem>
              <NDescriptionsItem :label="$t('page.manage.cache.value')">
                <div class="max-h-18rem overflow-auto">
                  {{ cacheDetail.value }}
                </div>
              </NDescriptionsItem>
            </NDescriptions>
          </NCard>
        </NSpin>
      </NGridItem>
    </NGrid>
  </div>
</template>

<style scoped></style>
