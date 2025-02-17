<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchUpdateUserProfile } from '@/service/api';

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

const userConfigForm: Form.ConfigForm = [
  {
    key: 'username',
    label: '用户名',
    type: 'input',
    placeholder: '请输入用户名',
    disabled: true
  },
  {
    key: 'nickName',
    label: '昵称',
    type: 'input',
    placeholder: '请输入昵称',
    required: true
  },
  {
    key: 'gender',
    label: '性别',
    type: 'radio',
    placeholder: '请选择性别',
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
    ]
  },
  {
    key: 'phone',
    label: '手机号',
    type: 'input',
    placeholder: '请输入手机号'
  },
  {
    key: 'email',
    label: '邮箱',
    type: 'input',
    placeholder: '请输入邮箱',
    required: true
  },
  {
    key: 'avatar',
    label: '头像',
    type: 'upload',
    placeholder: '请上传头像',
    required: true
  },
  {
    key: 'signature',
    label: '个性签名',
    type: 'input',
    placeholder: '请输入个性签名'
  },
  {
    key: 'address',
    label: '地址',
    type: 'input',
    placeholder: '请输入地址',
    disabled: true
  },
  {
    key: 'birthDate',
    label: '出生日期',
    type: 'input',
    placeholder: '请选择出生日期'
  },
  {
    key: 'introduction',
    label: '简介',
    type: 'input',
    placeholder: '请输入简介'
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
    Object.assign(model.value, props.rowData);
  }
  console.log(props.rowData);
}

async function updateUserProfile() {
  const { error, data } = await fetchUpdateUserProfile(model.value as any);
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
