/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      /** current page number */
      currentPage: number;
      /** page size */
      pageSize: number;
      /** total count */
      total: number;
    }

    /** common params of paginating query list data */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      list: T[];
    }

    /** common search params of table */
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'currentPage' | 'pageSize'>;

    /**
     * enable status
     *
     * - "1": enabled
     * - "2": disabled
     */
    type EnableStatus = 0 | 1;

    /** common record */
    type CommonRecord<T = any> = {
      /** record id */
      id: string;
      /** record creator */
      createBy: string;
      /** record create time */
      createdAt: string;
      /** record updater */
      updateBy: string;
      /** record update time */
      updatedAt: string;
      /** record status */
      status: EnableStatus | null;
      /** record children */
      children?: T[];
    } & T;
  }

  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      access_token: string;
    }

    interface CaptchaImg {
      id: string;
      img: string;
    }

    interface LoginDto {
      username: string;
      password: string;
      code: string;
      type?: string;
      captchaId?: string;
    }

    interface RegisterDto {
      email: string;
      password: string;
      code: string;
    }

    interface UserInfo {
      id: string;
      username: string;
      nickName: string;
      avatar: string;
      roles: string[];
      permissions: string[];
    }
  }

  /**
   * namespace Route
   *
   * backend api module: "route"
   */
  namespace Route {
    type ElegantConstRoute = import('@elegant-router/types').ElegantConstRoute;

    interface MenuRoute extends ElegantConstRoute {
      id: string;
    }

    interface UserRoute {
      routes: MenuRoute[];
      home: import('@elegant-router/types').LastLevelRouteKey;
    }
  }

  /**
   * namespace SystemManage
   *
   * backend api module: "systemManage"
   */
  namespace SystemManage {
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'currentPage' | 'pageSize'>;

    type Dept = Common.CommonRecord<{
      /** dept name */
      name: string;
      /** dept parent */
      parentId?: string;
      /** 排序 */
      order?: number | null;
      /** 是否默认 1 是 0 否 */
      default?: number;

      children?: Dept[];
    }>;

    type DeptSearchParams = CommonType.RecordNullable<Pick<Api.SystemManage.Role, 'name'> & CommonSearchParams>;

    type DeptTree = Dept[];

    type DeptList = Common.PaginatingQueryRecord<Dept>;

    /** role */
    type Role = Common.CommonRecord<{
      id: string;
      /** role name */
      name: string;
      /** role code */
      value: string;
      /** role description */
      description: string;
      /** role default */
      default: number;
      /** role menu */
      menuIds: string[];
    }>;

    /** role search params */
    type RoleSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Role, 'name' | 'value' | 'status'> & CommonSearchParams
    >;

    /** role list */
    type RoleList = Common.PaginatingQueryRecord<Role>;

    /** all role */
    type AllRole = Pick<Role, 'id' | 'name' | 'value'>;

    /** file info */
    type FileInfo = {
      name: string;
      url: string;
      id?: string;
      status?: string;
    };

    /**
     * user gender
     *
     * - "1": "male"
     * - "2": "female"
     */
    type UserGender = 0 | 1;

    /** user */
    type User = Common.CommonRecord<{
      /** user name */
      username: string;
      /** user profile */
      /** user role */
      roles: Role[];
      /** user dept */
      dept: Dept;
      /** roleIds */
      roleIds?: [];
      /** deptId */
      deptId?: string;
    }> &
      Profile;

    type Profile = Common.CommonRecord<{
      /** nick name */
      nickName: string;
      /** gender */
      gender: UserGender | null;
      /** phone */
      phone: string;
      /** email */
      email: string;
      /** avatar */
      avatar: Array<FileInfo> | string;
      /** signature */
      signature: string;
      address: string;
      birthDate: number | null;
      introduction: string;
    }>;

    type StatusDto = {
      ids: string[];
      status: number;
    };

    /** user search params */
    type UserSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.User, 'username' | 'gender' | 'nickName' | 'phone' | 'email' | 'status'> &
        CommonSearchParams & {
          /** user dept id */
          deptIds: string[];
          /** user role id */
          roleId: string;
        }
    >;

    /** user list */
    type UserList = Common.PaginatingQueryRecord<User>;

    /**
     * icon type
     *
     * - "1": iconify icon
     * - "2": local icon
     */
    type IconType = 0 | 1;

    /**
     * menu type
     *
     * - 0: directory
     * - 1: menu
     * - 2: permission
     */
    type MenuType = 0 | 1 | 2;
    type MenuButton = {
      /**
       * button code
       *
       * it can be used to control the button permission
       */
      code: string;
      /** button description */
      desc: string;
    };
    /** menu type */
    type MenuPropsOfRoute = Pick<
      import('vue-router').RouteMeta,
      | 'i18nKey'
      | 'keepAlive'
      | 'constant'
      | 'order'
      | 'href'
      | 'isExt'
      | 'extOpenMode'
      | 'hideInMenu'
      | 'activeMenu'
      | 'multiTab'
      | 'fixedIndexInTab'
      | 'query'
    >;
    type MenuSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Menu, 'title' | 'name' | 'path' | 'status'> & CommonSearchParams
    >;
    type MenuTreeItem = {
      id: string;
      title: string;
      pId: string;
      type: number;
      children?: MenuTreeItem[];
    };
    type MenuTree = MenuTreeItem[];
    type Menu = Common.CommonRecord<{
      /** parent menu id */
      parentId: string;
      /** parent menu title */
      parentTitle?: string;
      /** parent menu i18n key */
      parentI18Key?: App.I18n.I18nKey;
      /** menu type */
      type: MenuType;
      /** menu name */
      title: string;
      /** route name */
      name: string;
      /** route path */
      path: string | null;
      /** component */
      component?: string | null;
      /** iconify icon name or local icon name */
      icon: string | null;
      /** icon type */
      iconType: IconType;
      /** 权限 */
      permission?: string | null;
      /** children menu */
      children?: Menu[] | null;
    }> &
      MenuPropsOfRoute;
    type MenuList = Common.PaginatingQueryRecord<Menu>;

    /** online type */
    type OnlineUser = Common.CommonRecord<{
      /** token id */
      tokenId: string;
      /** dept name */
      deptName: string;
      /** user id */
      uid: string;
      /* username */
      username: string;
      /** is current user */
      isCurrentUser: boolean;
      /** disabled kick admin */
      disabled: boolean;
      /** ip */
      ip: string;
      /** address */
      address: string;
      /** operate system */
      os: string;
      /** browser */
      browser: string;
      /** login time */
      time: string;
      /** nick name */
      nickName: string;
    }>;
    type OnlineUserSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.OnlineUser, 'username' | 'nickName'> & CommonSearchParams
    >;
    type OnlineUserList = Common.PaginatingQueryRecord<OnlineUser>;

    /** login log type */
    type LoginLog = Common.CommonRecord<{
      /** ip */
      ip: string;
      /** address */
      address: string;
      /* username */
      username: string;
      /** operate system */
      os: string;
      /** browser */
      browser: string;
      /** login time */
      time: string;
      /** nick name */
      nickName: string;
    }>;
    type LoginLogSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.LoginLog, 'username' | 'ip' | 'address'> &
        CommonSearchParams & {
          time: Array<string> | null;
        }
    >;
    type LoginLogList = Common.PaginatingQueryRecord<LoginLog>;

    /** parameter type */
    type Parameter = Common.CommonRecord<{
      /** name */
      name: string;
      /** extName */
      key: string;
      /** size */
      value: string;
      /* url */
      remark: string;
      /** lastModified */
      updatedAt: string;
    }>;
    type ParameterSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Parameter, 'name'> & CommonSearchParams
    >;

    type ParameterList = Common.PaginatingQueryRecord<Parameter>;

    /** task type */
    type Task = Common.CommonRecord<{
      /** name */
      name: string;
      /** service */
      service: string;
      /** type */
      type: TaskType;
      /* status */
      status: number;
      /** startTime */
      startTime: Date | string | null;
      /** endTime */
      endTime: Date | string | null;
      /** limit */
      limit: number;
      /** cron */
      cron: string;
      /** every */
      every: number;
      /** data */
      data: string;
      /** jobOpts */
      jobOpts: string;
      /** remark */
      remark: string;
    }>;
    type TaskSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Task, 'name' | 'service' | 'status' | 'type'> & CommonSearchParams
    >;

    type TaskList = Common.PaginatingQueryRecord<Task>;
    type TaskType = 0 | 1;

    /** tasklog type */
    type TaskLog = Common.CommonRecord<{
      /** taskId */
      taskId: string;
      /** name */
      name: string;
      /** status */
      status: number;
      /** service */
      consumeTime: Date;
      /** type */
      detail: string;
      /** createdAt */
      createdAt: Date;
    }>;
    type TaskLogSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.TaskLog, 'name' | 'status'> & CommonSearchParams
    >;

    type TaskLogList = Common.PaginatingQueryRecord<TaskLog>;

    /** CaptchaLog type */
    type CaptchaLog = Common.CommonRecord<{
      /** account */
      account: string;
      /** code */
      code: string;
      /** provider */
      provider: Provider;
      /** createdAt */
      createdAt: Date;
    }>;
    type Provider = 'sms' | 'email' | 'captcha';

    type CaptchaLogSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.CaptchaLog, 'account' | 'provider'> & CommonSearchParams
    >;

    type CaptchaLogList = Common.PaginatingQueryRecord<CaptchaLog>;
  }

  /** tools manage */
  namespace ToolsManage {
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'currentPage' | 'pageSize'>;

    /** storage local type */
    type StorageLocal = Common.CommonRecord<{
      /** name */
      name: string;
      /** extName */
      extName: string;
      /* path */
      path: string;
      /** type */
      type: string;
      /** size */
      size: string;
      /** username */
      username: string;
      /** createdAt */
      createdAt: string;
    }>;
    type StorageLocalSearchParams = CommonType.RecordNullable<
      Pick<Api.ToolsManage.StorageLocal, 'username' | 'name'> &
        CommonSearchParams & {
          time: Array<string> | null;
        }
    >;
    type StorageLocalList = Common.PaginatingQueryRecord<StorageLocal>;

    /** storage oss type */
    type StorageOss = Common.CommonRecord<{
      /** name */
      name: string;
      /** extName */
      extName: string;
      /** size */
      size: string;
      /* url */
      url: string;
      /** lastModified */
      lastModified: string;
      /** type */
      type: string;
    }>;
    type StorageOssSearchParams = CommonType.RecordNullable<
      Pick<Api.ToolsManage.StorageOss, 'name'> & CommonSearchParams
    >;
    type StorageOssList = Common.PaginatingQueryRecord<StorageOss>;

    type Mail = {
      /** subject */
      subject: string;
      /** to */
      to: string;
      /** content */
      content: string;
    };
  }
}
