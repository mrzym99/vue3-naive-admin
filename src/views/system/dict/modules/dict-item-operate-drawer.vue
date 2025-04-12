<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { useConfigForm } from '@/hooks/common/config-form';
import { StatusEnum } from '@/constants/enum';
import { fetchCreateDictItem, fetchUpdateDictItem } from '@/service/api';

defineOptions({
  name: 'DictItemOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.DictItem | null;
  /** the drawer visible */
  typeId?: number;
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
    add: $t('page.manage.dict.dictItem.add'),
    edit: $t('page.manage.dict.dictItem.edit')
  };
  return titles[props.operateType];
});

type Model = Partial<Api.SystemManage.DictItem>;

const model = ref(createDefaultModel());

const dictConfigForm = useConfigForm<Model>(() => ({
  label: {
    key: 'label',
    label: $t('page.manage.dict.label'),
    type: 'Input',
    required: true,
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.dict.label')
    }
  },
  value: {
    key: 'value',
    label: $t('page.manage.dict.value'),
    type: 'Input',
    required: true,
    props: {
      placeholder: $t('common.pleaseEnter') + $t('page.manage.dict.value')
    }
  },
  order: {
    key: 'order',
    label: $t('page.manage.common.order'),
    type: 'InputNumber',
    required: true,
    props: {
      min: 1,
      max: 9999,
      placeholder: $t('common.pleaseEnter') + $t('page.manage.common.order')
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
    typeId: undefined,
    id: undefined,
    label: '',
    value: '',
    order: 1,
    remark: '',
    status: 1
  };
}

function handleInitModel() {
  model.value = createDefaultModel();
  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, props.rowData);
  }
  model.value.typeId = props.typeId;
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  const api = props.operateType === 'add' ? fetchCreateDictItem : fetchUpdateDictItem;
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
