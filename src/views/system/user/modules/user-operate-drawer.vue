<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchGetAllRole, fetchGetDeptTree, fetchUpdateUser } from '@/service/api';
import type { Option } from '@/components/advanced/config-form';
import { useConfigForm } from '@/hooks/common/config-form';
import { GenderEnum, StatusEnum } from '@/constants/enum';

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
    add: $t('page.manage.user.add'),
    edit: $t('page.manage.user.edit')
  };
  return titles[props.operateType];
});

type Model = Partial<Api.SystemManage.User>;

const model = ref(createDefaultModel());

const userConfigForm = useConfigForm<Model>(() => ({
  avatar: {
    key: 'avatar',
    label: $t('page.manage.user.avatar'),
    type: 'Upload',
    required: true,
    span: 24,
    props: {
      cropper: true,
      'list-type': 'image-card',
      max: 1
    }
  },
  deptId: {
    key: 'deptId',
    label: $t('page.manage.user.dept'),
    type: 'TreeSelect',
    required: true,
    props: {
      placeholder: $t('common.pleaseSelect') + $t('page.manage.user.dept'),
      options: []
    }
  },
  roleIds: {
    key: 'roleIds',
    label: $t('page.manage.user.role'),
    type: 'Select',
    required: true,
    props: {
      multiple: true,
      placeholder: $t('common.pleaseSelect') + $t('page.manage.user.role'),
      options: []
    }
  },
  username: {
    key: 'username',
    label: $t('page.manage.user.username'),
    type: 'Input',
    disabled: true,
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.user.username')
    }
  },
  nickName: {
    key: 'nickName',
    label: $t('page.manage.user.nickName'),
    type: 'Input',
    required: true,
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.user.nickName')
    }
  },
  gender: {
    key: 'gender',
    label: $t('page.manage.user.userGender'),
    type: 'Radio',
    required: true,
    options: [
      {
        label: $t('page.manage.user.gender.male'),
        value: GenderEnum.MALE
      },
      {
        label: $t('page.manage.user.gender.female'),
        value: GenderEnum.FEMALE
      }
    ]
  },
  email: {
    key: 'email',
    label: $t('page.manage.user.email'),
    type: 'Input',
    required: true,
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.user.email')
    }
  },
  phone: {
    key: 'phone',
    label: $t('page.manage.user.phone'),
    type: 'Input',
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.user.phone')
    }
  },
  address: {
    key: 'address',
    label: $t('page.manage.user.address'),
    type: 'Input',
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.user.address')
    }
  },
  birthDate: {
    key: 'birthDate',
    label: $t('page.manage.user.birthDate'),
    type: 'DatePicker',
    props: {
      type: 'date',
      placeholder: $t('common.pleaseSelect') + $t('page.manage.user.birthDate')
    }
  },
  status: {
    key: 'status',
    label: $t('common.status'),
    type: 'Radio',
    required: true,
    props: {
      placeholder: $t('common.pleaseSelect') + $t('common.status')
    },
    options: [
      {
        label: $t('common.enable'),
        value: StatusEnum.ENABLE
      },
      {
        label: $t('common.disable'),
        value: StatusEnum.DISABLE
      }
    ]
  },
  signature: {
    key: 'signature',
    label: $t('page.manage.user.signature'),
    type: 'Input',
    span: 24,
    props: {
      type: 'textarea',
      placeholder: $t('common.pleaseEnter') + $t('page.manage.user.signature')
    }
  },
  introduction: {
    key: 'introduction',
    label: $t('page.manage.user.introduction'),
    type: 'Input',
    span: 24,
    props: {
      type: 'textarea',
      placeholder: $t('common.pleaseEnter') + $t('page.manage.user.introduction')
    }
  }
}));

function createDefaultModel(): Model {
  return {
    id: '',
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

    userConfigForm.value.roleIds!.props!.options = options;
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
    userConfigForm.value.deptId!.props!.options = mapTree(data);
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
  <NDrawer v-model:show="visible" display-directive="show" class="lt-sm:!w-100%" width="50%">
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
