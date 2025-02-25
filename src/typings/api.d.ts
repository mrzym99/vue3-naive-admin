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
      // refreshToken: string;
    }

    interface LoginDto {
      username: string;
      password: string;
      code: string;
      type?: string;
    }

    interface UserInfo {
      id: string;
      username: string;
      nickName: string;
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

    type DeptSearchParams = {
      /** dept name */
      name?: string | null;
    };

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

    /**
     * user gender
     *
     * - "1": "male"
     * - "2": "female"
     */
    type UserGender = '0' | '1';

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

    type FileInfo = {
      name: string;
      url: string;
      id?: string;
      status?: string;
    };

    /** user search params */
    type UserSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.User, 'username' | 'gender' | 'nickName' | 'phone' | 'email' | 'status'> &
        CommonSearchParams & {
          /** user dept id */
          deptId: string;
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

    /** role search params */
    type MenuSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Menu, 'title' | 'name' | 'path' | 'status'> & CommonSearchParams
    >;

    type MenuTreeItem = {
      id: string;
      title: string;
      pId: string;
      children?: MenuTreeItem[];
    };

    type MenuTree = MenuTreeItem[];

    type Menu = Common.CommonRecord<{
      /** parent menu id */
      parentId: string;
      /** menu type */
      type: MenuType;
      /** menu name */
      title: string;
      /** route name */
      name: string;
      /** route path */
      path: string;
      /** component */
      component?: string;
      /** iconify icon name or local icon name */
      icon: string;
      /** icon type */
      iconType: IconType;
      /** 权限 */
      permission?: string | null;
      /** children menu */
      children?: Menu[] | null;
    }> &
      MenuPropsOfRoute;

    /** menu list */
    type MenuList = Common.PaginatingQueryRecord<Menu>;

    /** online user search params */
    type OnlineUserSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.OnlineUser, 'username' | 'nickName'> & CommonSearchParams
    >;

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

    type OnlineUserList = Common.PaginatingQueryRecord<OnlineUser>;

    /** login log type */
    type LoginLog = Common.CommonRecord<{
      /** ip id */
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

    /** online user search params */
    type LoginLogSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.LoginLog, 'username' | 'ip' | 'address'> &
        CommonSearchParams & {
          time: Array<string> | null;
        }
    >;

    type LoginLogList = Common.PaginatingQueryRecord<LoginLog>;
  }
}
