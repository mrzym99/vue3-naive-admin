<script setup lang="tsx">
import { NAvatar, NTag, NTime } from 'naive-ui';
import { type VNode, computed, onMounted, reactive } from 'vue';
import { useDetailDescriptions } from '@/hooks/common/detail-descriptions';
import { $t, getLocale } from '@/locales';
import { userGenderRecord } from '@/constants/business';
import { fetchGetUserInfo } from '@/service/api';
import type { DescriptionItem } from '@/components/advanced/details-descriptions/type';
import { useAppStore } from '@/store/modules/app';

type RenderFn<T> = (row: T) => VNode | Array<VNode> | string | null;

const appStore = useAppStore();
const columns = useDetailDescriptions<Api.SystemManage.User>(() => [
  {
    key: 'avatar',
    label: $t('page.manage.user.avatar'),
    span: 2,
    render: row => {
      if (row.avatar === null) {
        return null;
      }

      return <NAvatar src={row.avatar as string} size={64}></NAvatar>;
    }
  },
  {
    key: 'dept',
    label: $t('page.manage.user.dept')
  },
  {
    key: 'roles',
    label: $t('page.manage.user.role'),
    render: row => {
      if (row.rolesName.length === 0) return null;

      return row.rolesName.map((name: string) => <NTag class={'mr-8px'}>{name}</NTag>);
    }
  },
  {
    key: 'username',
    label: $t('page.manage.user.username')
  },
  {
    key: 'nickName',
    label: $t('page.manage.user.nickName')
  },
  {
    key: 'gender',
    label: $t('page.manage.user.userGender'),
    render: row => {
      if (row.gender === null) {
        return null;
      }

      const tagMap: Record<Api.SystemManage.UserGender, NaiveUI.ThemeColor> = {
        1: 'primary',
        0: 'error'
      };

      const label = $t(userGenderRecord[row.gender]);

      return <NTag type={tagMap[row.gender]}>{label}</NTag>;
    }
  },
  {
    key: 'email',
    label: $t('page.manage.user.email')
  },

  {
    key: 'phone',
    label: $t('page.manage.user.phone')
  },

  {
    key: 'address',
    label: $t('page.manage.user.address')
  },
  {
    key: 'birthDate',
    label: $t('page.manage.user.birthDate'),
    render: row => {
      if (!row.birthDate) {
        return null;
      }
      return <NTime time={new Date(row.birthDate)} format="yyyy-MM-dd" />;
    }
  },
  {
    key: 'signature',
    label: $t('page.manage.user.signature'),
    span: 2
  },
  {
    key: 'introduction',
    label: $t('page.manage.user.introduction'),
    span: 2
  }
]);

const details = reactive<Partial<Api.SystemManage.User>>({
  id: '',
  username: '',
  nickName: '',
  gender: null,
  phone: '',
  email: '',
  avatar: [],
  signature: '',
  address: '',
  birthDate: null,
  introduction: '',
  status: 1,
  rolesName: []
});

const descriptionItems = computed<DescriptionItem[]>(() => {
  if (!details.id) return [];
  const items: DescriptionItem[] = [];
  columns.value.forEach(item => {
    const { key, label, span, render } = item;
    const itemValue = details[key];

    items.push({
      key,
      label,
      span,
      render,
      value: itemValue
    });
  });
  return items;
});

const renderContent = (render: RenderFn<typeof details>): Array<VNode | string> => {
  const vNode = render(details);
  if (Array.isArray(vNode)) {
    return vNode;
  }
  return vNode ? [vNode] : [];
};

onMounted(async () => {
  const { data, error } = await fetchGetUserInfo();
  if (!error) {
    Object.assign(details, data);
  }
});
</script>

<template>
  <NDescriptions
    size="small"
    label-placement="left"
    :column="appStore.isMobile ? 1 : 2"
    :bordered="true"
    :content-style="{ padding: '16px' }"
  >
    <NDescriptionsItem
      v-for="item in descriptionItems"
      :key="item.key"
      :label-style="{ width: getLocale === 'zh-CN' ? '100px' : '120px' }"
      :span="item.span"
      :label="item.label"
    >
      <template v-if="item.render">
        <template v-for="node in renderContent(item.render)" :key="node">
          <span v-if="typeof node === 'string'">{{ node }}</span>
          <component :is="node" v-else />
        </template>
      </template>
      <template v-else>
        {{ item.value }}
      </template>
    </NDescriptionsItem>
  </NDescriptions>
</template>

<style scoped></style>
