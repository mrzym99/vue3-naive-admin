<script setup lang="tsx">
import { NButton } from 'naive-ui';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { $t } from '@/locales';
import { fetchCheck, fetchPay } from '@/service/api';

type Goods = {
  id: number;
  name: string;
  price: number;
  formatePrice: string;
  img: string;
  desc: () => string;
};

const orderId = ref<number | null>(null);

const goodList: Goods[] = [
  {
    id: 1,
    name: 'iPhone 16 Pro Max',
    price: 9999,
    formatePrice: '9,999',
    img: 'https://nest-image.mrzym.top/goods/iphone.png',
    desc: () => $t('page.tools.pay.goodDesc1')
  },
  {
    id: 2,
    name: 'BMW 425',
    price: 386900,
    formatePrice: '386,900',
    img: 'https://nest-image.mrzym.top/goods/bmw425.png',
    desc: () => $t('page.tools.pay.goodDesc2')
  },
  {
    id: 3,
    name: '911 Carrera',
    price: 1554600,
    formatePrice: '1,554,600',
    img: 'https://nest-image.mrzym.top/goods/911.png',
    desc: () => $t('page.tools.pay.goodDesc3')
  }
];

const loading = ref(false);
async function handlePay({ name, price, desc }: Goods) {
  const newOrderId = Date.now() + Math.floor(Math.random() * 1000);

  window.$dialog?.info({
    title: $t('common.tip'),
    content: $t('page.tools.pay.confirmPurchase', {
      name
    }),
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    onPositiveClick: async () => {
      // 随机生成数字订单号
      // 修复后的随机数字ID生成 (替换原有orderId生成逻辑)
      orderId.value = newOrderId;
      loading.value = true;
      const { error, data } = await fetchPay({
        orderId: newOrderId,
        price,
        desc: `${name} ${desc()}`
      });

      loading.value = false;
      if (!error) {
        window.open(data, '_blank', 'noopener,noreferrer');
      }
    }
  });
}

// 在setup中
const handleVisibilityChange = async () => {
  if (document.visibilityState === 'visible') {
    if (orderId.value) {
      const { error, data } = await fetchCheck(orderId.value);
      if (!error && data) {
        window.$message?.success($t('page.tools.pay.paySuccess'));
        orderId.value = null;
      } else {
        window.$message?.error($t('page.tools.pay.payFail'));
      }
    }
  }
};

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-auto">
    <NCard :bordered="false" size="small" class="flex-1 card-wrapper">
      <NAlert class="mb-16px">
        <NMarquee>{{ $t('page.tools.pay.payEnvironmentTip') }}</NMarquee>
        <div>{{ $t('page.tools.pay.username') }}: blmhyl2624@sandbox.com</div>
        <div>
          <span>{{ $t('page.tools.pay.password') }}: 111111</span>
          &nbsp;
          <span>{{ $t('page.tools.pay.payPassword') }}: 111111</span>
        </div>
      </NAlert>
      <NSpin :show="loading">
        <NGrid cols="1 600:3" x-gap="16" y-gap="16">
          <NGridItem v-for="(item, index) in goodList" :key="index">
            <div class="overflow-hidden border border-[#efeff5] rounded-md">
              <img class="aspect-[16/9] w-full" :src="item.img" alt="" />
              <div class="py-16px">
                <h3 class="text-center text-xl font-bold leading-loose">{{ item.name }}</h3>
                <div class="text-center text-xl leading-loose">{{ item.formatePrice }} RMB</div>
                <div class="text-md text-center leading-loose">{{ item.desc() }}</div>
                <NSpace class="mt-16px" justify="center">
                  <NButton round type="primary" @click="handlePay(item)">{{ $t('page.tools.pay.purchase') }}</NButton>
                </NSpace>
              </div>
            </div>
          </NGridItem>
        </NGrid>
      </NSpin>
    </NCard>
  </div>
</template>

<style scoped lang="scss"></style>
