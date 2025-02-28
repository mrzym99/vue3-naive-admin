import { transLateRecordToOption } from '@/utils/common';
import { ProviderEnum, StatusEnum, TaskTypeEnum } from './enum';

export const enableStatusRecord: Record<Api.Common.EnableStatus, App.I18n.I18nKey> = {
  [StatusEnum.ENABLE]: 'page.manage.common.status.enable',
  [StatusEnum.DISABLE]: 'page.manage.common.status.disable'
};

export const enableStatusOptions = transLateRecordToOption(enableStatusRecord).sort((a, b) => b.value - a.value);

export const userGenderRecord: Record<Api.SystemManage.UserGender, App.I18n.I18nKey> = {
  0: 'page.manage.user.gender.female',
  1: 'page.manage.user.gender.male'
};

export const userGenderOptions = transLateRecordToOption(userGenderRecord).sort((a, b) => b.value - a.value);

export const menuTypeRecord: Record<Api.SystemManage.MenuType, App.I18n.I18nKey> = {
  0: 'page.manage.menu.type.directory',
  1: 'page.manage.menu.type.menu',
  2: 'page.manage.menu.type.permission'
};

export const menuTypeOptions = transLateRecordToOption(menuTypeRecord);

export const menuIconTypeRecord: Record<Api.SystemManage.IconType, App.I18n.I18nKey> = {
  0: 'page.manage.menu.iconType.iconify',
  1: 'page.manage.menu.iconType.local'
};

export const menuIconTypeOptions = transLateRecordToOption(menuIconTypeRecord);

export const TaskTypeRecord: Record<Api.Common.EnableStatus, App.I18n.I18nKey> = {
  [TaskTypeEnum.CRON]: 'page.manage.task.type.cron',
  [TaskTypeEnum.INTERVAL]: 'page.manage.task.type.interval'
};

export const taskTypeOptions = transLateRecordToOption(TaskTypeRecord);

export const ProviderRecord: Record<Api.SystemManage.Provider, App.I18n.I18nKey> = {
  [ProviderEnum.CAPTCHA]: 'page.manage.captcha.provider.captcha',
  [ProviderEnum.EMAIL]: 'page.manage.captcha.provider.email',
  [ProviderEnum.SMS]: 'page.manage.captcha.provider.sms'
};

export const providerOptions = transLateRecordToOption(ProviderRecord, true);
