<script setup lang="tsx">
import { computed, onMounted, reactive, ref } from 'vue';
import { type FormInst, useDialog } from 'naive-ui';
import { $t, getLocale } from '@/locales';
import { GenderEnum } from '@/constants/enum';
import { REG_EMAIL, REG_PHONE } from '@/constants/reg';
import { deleteFiles, fetchGetAccountInfo, fetchUpdateAccount } from '@/service/api';
import { useAuthStore } from '@/store/modules/auth';

type Model = Partial<Api.SystemManage.User> & { avatar: Api.SystemManage.FileInfo[] };

const emit = defineEmits(['change']);

const { userInfo } = useAuthStore();
const model = ref<Model>(createDefaultModel());
const loading = ref(false);
const getDataLoading = ref(false);
const formRef = ref<FormInst | null>(null);
const dialog = useDialog();
const originalAvatar = ref('');
function createDefaultModel(): Model {
  return {
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
    introduction: ''
  };
}

const rules = reactive({
  avatar: [
    {
      required: true,
      trigger: 'blur',
      validator(_rule: any, value: number | string | Array<any>) {
        const message = `${$t('page.manage.user.avatar')}${getLocale.value === 'zh-CN' ? '必填' : ' is Required'}`;
        if (Array.isArray(value) && value.length === 0) {
          return new Error(message);
        }
        return true;
      }
    }
  ],
  username: [
    {
      required: true,
      message: `${$t('page.manage.user.username')}${getLocale.value === 'zh-CN' ? '必填' : ' is Required'}`,
      trigger: 'blur'
    }
  ],
  nickName: [
    {
      required: true,
      message: `${$t('page.manage.user.nickName')}${getLocale.value === 'zh-CN' ? '必填' : ' is Required'}`,
      trigger: 'blur'
    }
  ],
  gender: [
    {
      required: true,
      trigger: 'change',
      validator(_rule: any, value: number | string | Array<any>) {
        const message = `${$t('page.manage.user.userGender')}${getLocale.value === 'zh-CN' ? '必填' : ' is Required'}`;
        if (typeof value === 'number' && String(value).length === 0) {
          return new Error(message);
        }
        return true;
      }
    }
  ],
  email: [
    {
      required: true,
      message: `${$t('page.manage.user.email')}${getLocale.value === 'zh-CN' ? '必填' : ' is Required'}`,
      trigger: 'blur'
    },
    {
      pattern: REG_EMAIL,
      message: $t('page.tools.mail.pleaseEnterCorrectEmail'),
      trigger: 'blur'
    }
  ],
  phone: [
    {
      pattern: REG_PHONE,
      message: $t('form.phone.invalid'),
      trigger: 'change'
    }
  ]
});

const computedLabelWidth = computed(() => {
  if (getLocale.value === 'zh-CN') {
    return 120;
  }
  return 150;
});

const handleSubmit = async () => {
  loading.value = true;
  const { avatar, ...rest } = model.value;
  const { error } = await fetchUpdateAccount({
    ...rest,
    avatar: avatar[0].url
  });
  if (originalAvatar.value !== avatar[0].url) {
    deleteFiles([originalAvatar.value]);
  }
  loading.value = false;
  if (!error) {
    window.$message?.success($t('common.modifySuccess'));
    emit('change');
    getProfile();
  }
};

const handleConfirm = async () => {
  await formRef.value?.validate();
  dialog.info({
    title: $t('common.tip'),
    content: $t('common.confirmModify'),
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    onPositiveClick: () => {
      handleSubmit();
    }
  });
};

const isSuperAdmin = computed(() => {
  return userInfo.roles.includes('super-admin');
});

async function getProfile() {
  getDataLoading.value = true;
  const { data, error } = await fetchGetAccountInfo();
  if (!error) {
    const { birthDate } = data;
    const timeStamp = birthDate ? new Date(birthDate).getTime() : null;
    model.value = {
      ...data,
      avatar: [
        {
          name: 'avatar',
          url: data.avatar as string,
          status: 'finished'
        }
      ],
      birthDate: timeStamp
    };
    originalAvatar.value = data.avatar as string;
    getDataLoading.value = false;
  }
}

onMounted(async () => {
  getProfile();
});
</script>

<template>
  <NForm
    ref="formRef"
    class="p-10px"
    :model="model"
    :rules="rules"
    v-bind="$attrs"
    label-placement="left"
    :label-width="computedLabelWidth"
    require-mark-placement="right"
  >
    <NSpin :delay="0" :show="getDataLoading">
      <NGrid responsive="screen" item-responsive>
        <NFormItemGi :span="24" :label="$t('page.manage.user.avatar')" path="avatar">
          <FileUpload v-model:value="model.avatar" :max="1" :cropper="true" list-type="image-card" />
        </NFormItemGi>
        <NFormItemGi span="24 m:12" :label="$t('page.manage.user.username')" path="username">
          <NInput
            v-model:value="model.username"
            disabled
            clearable
            :placeholder="$t('common.pleaseEnter') + $t('page.manage.user.username')"
          />
        </NFormItemGi>
        <NFormItemGi span="24 m:12" :label="$t('page.manage.user.nickName')" path="nickName">
          <NInput
            v-model:value="model.nickName"
            clearable
            :placeholder="$t('common.pleaseEnter') + $t('page.manage.user.nickName')"
          />
        </NFormItemGi>
        <NFormItemGi span="24 m:12" :label="$t('page.manage.user.userGender')" path="gender">
          <NRadioGroup v-model:value="model.gender">
            <NSpace>
              <NRadio :value="GenderEnum.MALE">
                {{ $t('page.manage.user.gender.male') }}
              </NRadio>
              <NRadio :value="GenderEnum.FEMALE">
                {{ $t('page.manage.user.gender.female') }}
              </NRadio>
            </NSpace>
          </NRadioGroup>
        </NFormItemGi>
        <NFormItemGi span="24 m:12" :label="$t('page.manage.user.email')" path="email">
          <NInput
            v-model:value="model.email"
            disabled
            clearable
            :placeholder="$t('common.pleaseEnter') + $t('page.manage.user.email')"
          />
        </NFormItemGi>
        <NFormItemGi span="24 m:12" :label="$t('page.manage.user.phone')" path="phone">
          <NInput
            v-model:value="model.phone"
            clearable
            :placeholder="$t('common.pleaseEnter') + $t('page.manage.user.phone')"
          />
        </NFormItemGi>
        <NFormItemGi span="24 m:12" :label="$t('page.manage.user.address')" path="address">
          <NInput
            v-model:value="model.address"
            clearable
            :placeholder="$t('common.pleaseEnter') + $t('page.manage.user.address')"
          />
        </NFormItemGi>
        <NFormItemGi span="24 m:12" :label="$t('page.manage.user.birthDate')" path="birthDate">
          <NDatePicker
            v-model:value="model.birthDate"
            clearable
            type="date"
            :placeholder="$t('common.pleaseSelect') + $t('page.manage.user.birthDate')"
          />
        </NFormItemGi>
        <NFormItemGi :span="24" :label="$t('page.manage.user.signature')" path="signature">
          <NInput
            v-model:value="model.signature"
            clearable
            type="textarea"
            :placeholder="$t('common.pleaseEnter') + $t('page.manage.user.signature')"
          />
        </NFormItemGi>
        <NFormItemGi :span="24" :label="$t('page.manage.user.introduction')" path="introduction">
          <NInput
            v-model:value="model.introduction"
            clearable
            type="textarea"
            :placeholder="$t('common.pleaseEnter') + $t('page.manage.user.introduction')"
          />
        </NFormItemGi>
      </NGrid>
      <NSpace v-if="!isSuperAdmin" justify="end">
        <NButton type="primary" :loading="loading" @click="handleConfirm">
          {{ $t('common.modify') }}
        </NButton>
      </NSpace>
    </NSpin>
  </NForm>
</template>
