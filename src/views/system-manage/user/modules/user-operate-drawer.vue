<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchUpdateUserProfile } from '@/service/api';
import type { ConfigFormType } from '@/components/advanced/config-form/type';

defineOptions({
  name: 'UserOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.User | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.manage.user.addUser'),
    edit: $t('page.manage.user.editUser')
  };
  return titles[props.operateType];
});

type Model = Partial<Api.SystemManage.User>;

const model = ref(createDefaultModel());

const userConfigForm: ConfigFormType = [
  {
    key: 'username',
    label: '用户名',
    type: 'Input',
    disabled: true,
    props: {
      placeholder: '请输入用户名'
    }
  },
  {
    key: 'nickName',
    label: '昵称',
    type: 'Input',
    required: true,
    props: {
      placeholder: '请输入昵称'
    }
  },
  {
    key: 'gender',
    label: '性别',
    type: 'Radio',
    required: true,
    options: [
      {
        label: '男',
        value: '1'
      },
      {
        label: '女',
        value: '0'
      }
    ],
    props: {
      placeholder: '请选择性别'
    }
  },
  {
    key: 'phone',
    label: '手机号',
    type: 'Input',
    props: {
      placeholder: '请输入手机号'
    }
  },
  {
    key: 'email',
    label: '邮箱',
    type: 'Input',
    required: true,
    props: {
      placeholder: '请输入邮箱'
    }
  },
  {
    key: 'avatar',
    label: '头像',
    type: 'Upload',
    required: true,
    props: {
      placeholder: '请上传头像'
    }
  },
  {
    key: 'signature',
    label: '个性签名',
    type: 'Input',
    props: {
      placeholder: '请输入个性签名'
    }
  },
  {
    key: 'address',
    label: '地址',
    type: 'Input',
    props: {
      placeholder: '请输入地址'
    }
  },
  {
    key: 'status',
    label: '状态',
    type: 'Select',
    required: true,
    disabled: true,
    props: {
      placeholder: '请选择状态',
      options: [
        {
          label: '正常',
          value: '1'
        },
        {
          label: '禁用'
        }
      ]
    }
  },
  {
    key: 'birthDate',
    label: '出生日期',
    type: 'DatePicker',
    props: {
      type: 'date',
      placeholder: '请选择出生日期'
    }
  },
  {
    key: 'introduction',
    label: '简介',
    type: 'Input',
    span: 24,
    props: {
      type: 'textarea',
      placeholder: '请输入简介'
    }
  }
];

function createDefaultModel(): Model {
  return {
    username: '',
    nickName: '',
    gender: null,
    phone: '',
    email: '',
    avatar: '',
    signature: '',
    address: '',
    birthDate: '',
    introduction: ''
  };
}

/** the enabled role options */
const roleOptions = ref<CommonType.Option<string>[]>([]);

async function getRoleOptions() {
  // const { error, data } = await fetchGetAllRoles();

  // if (!error) {
  // const options = data.map(item => ({
  //   label: item.roleName,
  //   value: item.roleCode
  // }));

  // // the mock data does not have the roleCode, so fill it
  // // if the real request, remove the following code
  // const userRoleOptions = model.value.userRoles.map(item => ({
  //   label: item,
  //   value: item
  // }));
  // end

  roleOptions.value = [];
  // }
}

function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    const { birthDate, gender } = props.rowData;
    const timeStamp = new Date(birthDate).getTime();
    Object.assign(model.value, props.rowData, {
      birthDate: timeStamp,
      gender: String(gender)
    });
  }
}

async function updateUserProfile() {
  const { error, data } = await fetchUpdateUserProfile(props.rowData!.id, model.value as any);
  if (!error) {
    console.log(data);
    window.$message?.success($t('common.updateSuccess'));
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  await updateUserProfile();
  // request
  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    nextTick(() => {
      restoreValidation();
    });
    getRoleOptions();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" width="40%">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <ConfigForm ref="formRef" v-model:model="model" :fields="userConfigForm" />
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
