<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchGetAllRole, fetchGetDeptTree, fetchUpdateUser } from '@/service/api';
import type { ConfigFormArrayType, Option } from '@/components/advanced/config-form';
import { enableStatusOptions, userGenderOptions } from '@/constants/business';

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

const userConfigForm = reactive<ConfigFormArrayType>([
  {
    key: 'avatar',
    label: '头像',
    type: 'Upload',
    required: true,
    span: 24,
    props: {
      cropper: true,
      placeholder: '请上传头像',
      'list-type': 'image-card',
      max: 1
    }
  },
  {
    key: 'deptId',
    label: '所属部门',
    type: 'TreeSelect',
    required: true,
    props: {
      placeholder: '请选择所属部门',
      options: []
    }
  },
  {
    key: 'roleIds',
    label: '所属角色',
    type: 'Select',
    required: true,
    props: {
      multiple: true,
      placeholder: '请选择角色',
      options: []
    }
  },
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
    options: userGenderOptions,
    props: {
      placeholder: '请选择性别'
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
    key: 'phone',
    label: '手机号码',
    type: 'Input',
    props: {
      placeholder: '请输入手机号码'
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
    key: 'birthDate',
    label: '出生日期',
    type: 'DatePicker',
    props: {
      type: 'date',
      placeholder: '请选择出生日期'
    }
  },
  {
    key: 'status',
    label: '状态',
    type: 'Radio',
    required: true,
    props: {
      placeholder: '请选择状态'
    },
    options: enableStatusOptions
  },
  {
    key: 'signature',
    label: '个性签名',
    type: 'Input',
    span: 24,
    props: {
      type: 'textarea',
      placeholder: '请输入个性签名'
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
]);

function createDefaultModel(): Model {
  return {
    roleIds: [],
    deptId: '',
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
    status: 1
  };
}

async function getRoleOptions() {
  const { error, data } = await fetchGetAllRole();

  if (!error) {
    const options = data
      ? data.map(item => ({
          label: item.name,
          value: item.id
        }))
      : [];

    userConfigForm[2]!.props!.options = options;
  }
}

function mapTree(tree: Api.SystemManage.DeptTree): Option[] {
  return tree.map(item => {
    const { children } = item;
    return {
      label: item.name,
      value: item.id,
      key: item.id,
      isLeaf: !children || children.length === 0,
      children: children ? mapTree(children) : []
    };
  });
}

async function getDeptTree() {
  const { data, error } = await fetchGetDeptTree();
  if (!error) {
    userConfigForm[1]!.props!.options = mapTree(data);
  }
}

function handleInitModel() {
  model.value = createDefaultModel();
  if (props.operateType === 'edit' && props.rowData) {
    const { birthDate, roles, dept } = props.rowData;
    const timeStamp = birthDate ? new Date(birthDate).getTime() : null;
    Object.assign(model.value, props.rowData, {
      birthDate: timeStamp,
      roleIds: roles && roles.length ? roles.map(r => r.id) : [],
      deptId: dept ? dept.id : '',
      avatar: [
        {
          name: 'avatar',
          url: props.rowData.avatar,
          status: 'finished'
        }
      ]
    });
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  const { avatar, ...values } = model.value;
  const avatarUrl = Array.isArray(avatar) ? avatar[0].url : avatar;
  const { error } = await fetchUpdateUser(props.rowData!.id, {
    avatar: avatarUrl,
    ...values
  } as any);
  if (!error) {
    const message = props.operateType === 'add' ? $t('common.addSuccess') : $t('common.updateSuccess');
    window.$message?.success(message);
    // request
    closeDrawer();
    emit('submitted');
  }
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    nextTick(() => {
      restoreValidation();
    });
    getDeptTree();
    getRoleOptions();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" width="50%">
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
