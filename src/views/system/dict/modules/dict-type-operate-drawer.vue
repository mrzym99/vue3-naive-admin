<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { useConfigForm } from '@/hooks/common/config-form';
import { StatusEnum } from '@/constants/enum';
import { fetchCreateDictType, fetchUpdateDictType } from '@/service/api';

defineOptions({
  name: 'DictTypeOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.DictType | null;
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
    add: $t('page.manage.dict.dictType.add'),
    edit: $t('page.manage.dict.dictType.edit')
  };
  return titles[props.operateType];
});

type Model = Partial<Api.SystemManage.DictType>;

const model = ref(createDefaultModel());

const dictConfigForm = useConfigForm<Model>(() => ({
  name: {
    key: 'name',
    label: $t('page.manage.dict.name'),
    type: 'Input',
    required: true,
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.dict.name')
    }
  },
  code: {
    key: 'code',
    label: $t('page.manage.dict.code'),
    type: 'Input',
    required: true,
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.dict.code')
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
  remark: {
    key: 'remark',
    label: $t('page.manage.common.remark'),
    type: 'Input',
    span: 24,
    props: {
      type: 'textarea',
      placeholder: $t('common.pleaseEnter') + $t('page.manage.common.remark')
    }
  }
}));

function createDefaultModel(): Model {
  return {
    id: '',
    name: '',
    code: '',
    remark: '',
    status: 1
  };
}

function handleInitModel() {
  model.value = createDefaultModel();
  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  const api = props.operateType === 'add' ? fetchCreateDictType : fetchUpdateDictType;
  const { error } = await api(model.value as any);
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
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" class="lt-sm:!w-100%" width="50%">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <ConfigForm ref="formRef" v-model:model="model" :fields="dictConfigForm" />
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
