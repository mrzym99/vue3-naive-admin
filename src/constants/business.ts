import { transformRecordToOption } from '@/utils/common';
import { TaskTypeEnum } from './enum';

export const enableStatusRecord: Record<Api.Common.EnableStatus, App.I18n.I18nKey> = {
  1: 'page.manage.common.status.enable',
  0: 'page.manage.common.status.disable'
};

export const enableStatusOptions = transformRecordToOption(enableStatusRecord);

export const userGenderRecord: Record<Api.SystemManage.UserGender, App.I18n.I18nKey> = {
  0: 'page.manage.user.gender.female',
  1: 'page.manage.user.gender.male'
};

export const userGenderOptions = transformRecordToOption(userGenderRecord);

export const menuTypeRecord: Record<Api.SystemManage.MenuType, App.I18n.I18nKey> = {
  0: 'page.manage.menu.type.directory',
  1: 'page.manage.menu.type.menu',
  2: 'page.manage.menu.type.permission'
};

export const menuTypeOptions = transformRecordToOption(menuTypeRecord);

export const menuIconTypeRecord: Record<Api.SystemManage.IconType, App.I18n.I18nKey> = {
  0: 'page.manage.menu.iconType.iconify',
  1: 'page.manage.menu.iconType.local'
};

export const menuIconTypeOptions = transformRecordToOption(menuIconTypeRecord);

export const TaskTypeRecord: Record<Api.Common.EnableStatus, App.I18n.I18nKey> = {
  [TaskTypeEnum.CRON]: 'page.manage.task.type.cron',
  [TaskTypeEnum.INTERVAL]: 'page.manage.task.type.interval'
};
