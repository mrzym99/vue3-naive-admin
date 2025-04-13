const local: App.I18n.Schema = {
  system: {
    title: 'Vue3NaiveAdmin',
    updateTitle: 'System Version Update Notification',
    updateContent: 'A new version of the system has been detected. Do you want to refresh the page immediately?',
    updateConfirm: 'Refresh immediately',
    updateCancel: 'Later'
  },
  common: {
    action: 'Action',
    add: 'Add',
    addSuccess: 'Add Success',
    backToHome: 'Back to home',
    batchDelete: 'Batch Delete',
    batchDisable: 'Batch Disable',
    enable: 'Enable',
    disable: 'Disable',
    status: 'Status',
    cancel: 'Cancel',
    close: 'Close',
    check: 'Check',
    expandColumn: 'Expand Column',
    columnSetting: 'Column Setting',
    config: 'Config',
    confirm: 'Confirm',
    delete: 'Delete',
    deleteSuccess: 'Delete Success',
    expand: 'Expand',
    fold: 'Fold',
    confirmDelete: 'Are you sure you want to delete?',
    edit: 'Edit',
    warning: 'Warning',
    error: 'Error',
    index: 'Index',
    keywordSearch: 'Please enter keyword',
    logout: 'Logout',
    logoutConfirm: 'Are you sure you want to log out?',
    lookForward: 'Coming soon',
    modify: 'Modify',
    modifySuccess: 'Modify Success',
    confirmModify: 'Are you sure you want to modify?',
    noData: 'No Data',
    operate: 'Operate',
    pleaseCheckValue: 'Please check whether the value is valid',
    refresh: 'Refresh',
    reset: 'Reset',
    search: 'Search',
    switch: 'Switch',
    tip: 'Tip',
    trigger: 'Trigger',
    update: 'Update',
    updateSuccess: 'Update Success',
    userCenter: 'User Center',
    yesOrNo: {
      yes: 'Yes',
      no: 'No'
    },
    successOrFailRecord: {
      success: 'Success',
      fail: 'Fail'
    },
    setDefault: 'SetDefault',
    noPermission: 'Sorry, you do not have permission!',
    pleaseEnter: 'Please enter the ',
    pleaseSelect: 'Please select the ',
    createdAt: 'CreateTime',
    updatedAt: 'UpdateTime',
    operateSuccess: 'Operate Success',
    resetSuccess: 'Reset Success',
    save: 'Save',
    saveSuccess: 'Save Success',
    confirmSave: 'Are sure you want to save?',
    detail: 'Details'
  },
  request: {
    logout: 'Logout user after request failed',
    logoutMsg: 'User status is invalid, please log in again',
    logoutWithModal: 'Pop up modal after request failed and then log out user',
    logoutWithModalMsg: 'User status is invalid, please log in again',
    refreshToken: 'The requested token has expired, refresh the token',
    tokenExpired: 'The requested token has expired'
  },
  theme: {
    themeSchema: {
      title: 'Theme Schema',
      light: 'Light',
      dark: 'Dark',
      auto: 'Follow System'
    },
    grayscale: 'Grayscale',
    colourWeakness: 'Colour Weakness',
    layoutMode: {
      title: 'Layout Mode',
      vertical: 'Vertical Menu Mode',
      horizontal: 'Horizontal Menu Mode',
      'vertical-mix': 'Vertical Mix Menu Mode',
      'horizontal-mix': 'Horizontal Mix menu Mode',
      reverseHorizontalMix: 'Reverse first level menus and child level menus position'
    },
    recommendColor: 'Apply Recommended Color Algorithm',
    recommendColorDesc: 'The recommended color algorithm refers to',
    themeColor: {
      title: 'Theme Color',
      primary: 'Primary',
      info: 'Info',
      success: 'Success',
      warning: 'Warning',
      error: 'Error',
      followPrimary: 'Follow Primary'
    },
    scrollMode: {
      title: 'Scroll Mode',
      wrapper: 'Wrapper',
      content: 'Content'
    },
    page: {
      animate: 'Page Animate',
      mode: {
        title: 'Page Animate Mode',
        fade: 'Fade',
        'fade-slide': 'Slide',
        'fade-bottom': 'Fade Zoom',
        'fade-scale': 'Fade Scale',
        'zoom-fade': 'Zoom Fade',
        'zoom-out': 'Zoom Out',
        none: 'None'
      }
    },
    fixedHeaderAndTab: 'Fixed Header And Tab',
    header: {
      height: 'Header Height',
      breadcrumb: {
        visible: 'Breadcrumb Visible',
        showIcon: 'Breadcrumb Icon Visible'
      },
      multilingual: {
        visible: 'Display multilingual button'
      }
    },
    tab: {
      visible: 'Tab Visible',
      cache: 'Tag Bar Info Cache',
      height: 'Tab Height',
      mode: {
        title: 'Tab Mode',
        chrome: 'Chrome',
        button: 'Button'
      }
    },
    sider: {
      inverted: 'Dark Sider',
      width: 'Sider Width',
      collapsedWidth: 'Sider Collapsed Width',
      mixWidth: 'Mix Sider Width',
      mixCollapsedWidth: 'Mix Sider Collapse Width',
      mixChildMenuWidth: 'Mix Child Menu Width'
    },
    footer: {
      visible: 'Footer Visible',
      fixed: 'Fixed Footer',
      height: 'Footer Height',
      right: 'Right Footer'
    },
    watermark: {
      visible: 'Watermark Full Screen Visible',
      text: 'Watermark Text'
    },
    themeDrawerTitle: 'Theme Configuration',
    pageFunTitle: 'Page Function',
    resetCacheStrategy: {
      title: 'Reset Cache Strategy',
      close: 'Close Page',
      refresh: 'Refresh Page'
    },
    configOperation: {
      copyConfig: 'Copy Config',
      copySuccessMsg: 'Copy Success, Please replace the variable "themeSettings" in "src/theme/settings.ts"',
      resetConfig: 'Reset Config',
      resetSuccessMsg: 'Reset Success'
    }
  },
  route: {
    login: 'Login',
    403: 'No Permission',
    404: 'Page Not Found',
    500: 'Server Error',
    'iframe-page': 'Iframe',
    home: 'Home',
    document: 'Document',
    document_project: 'Project Document',
    'document_project-link': 'Project Document(External Link)',
    document_vue: 'Vue Document',
    document_vite: 'Vite Document',
    document_unocss: 'UnoCSS Document',
    document_naive: 'Naive UI Document',
    document_antd: 'Ant Design Vue Document',
    blog: 'Blog',
    blog_zym: 'XiaoZhang‘s Blog',
    'blog_zym-href': 'XiaoZhang‘s Blog(External Link)',
    'user-center': 'User Center',
    about: 'About',
    system: 'SystemManage',
    system_role: 'Role Mange',
    system_user: 'User Mange',
    system_dept: 'Dept Manage',
    system_menu: 'Menu Manage',
    system_parameter: 'Parameter Manage',
    system_schedule: 'Task Schedule',
    system_schedule_task: 'Schedule Task',
    'system_schedule_task-log': 'Schedule Task Log',
    'system_monitor_captcha-log': 'Captcha Log',
    system_monitor: 'System monitor',
    system_monitor_online: 'Online User',
    'system_monitor_login-log': 'LoginLog Manage',
    system_monitor_serve: 'Serve Monitor',
    system_monitor_cache: 'Cache List',
    system_dict: 'Dictionary Manage',
    system_notice: 'System Notice',
    'system_notice_notice-operate': 'Notice Operate',
    tools: 'Tools',
    tools_storage: 'Storage Manage',
    tools_storage_local: 'Local Storage',
    tools_storage_oss: 'Oss Storage',
    tools_mail: 'Send Email',
    tools_sql: 'Database Manage',
    exception: 'Exception',
    exception_403: '403',
    exception_404: '404',
    exception_500: '500',
    plugin: 'Plugin',
    plugin_copy: 'Copy',
    plugin_charts: 'Charts',
    plugin_charts_echarts: 'ECharts',
    plugin_charts_antv: 'AntV',
    plugin_charts_vchart: 'VChart',
    plugin_editor: 'Editor',
    plugin_editor_quill: 'Quill',
    plugin_editor_markdown: 'Markdown',
    plugin_icon: 'Icon',
    plugin_map: 'Map',
    plugin_print: 'Print',
    plugin_swiper: 'Swiper',
    plugin_video: 'Video',
    plugin_barcode: 'Barcode',
    plugin_pinyin: 'pinyin',
    plugin_excel: 'Excel',
    plugin_pdf: 'PDF preview',
    plugin_gantt: 'Gantt Chart',
    plugin_gantt_dhtmlx: 'dhtmlxGantt',
    plugin_gantt_vtable: 'VTableGantt',
    plugin_typeit: 'Typeit',
    plugin_tables: 'Tables',
    plugin_tables_vtable: 'VTable'
  },
  page: {
    login: {
      common: {
        loginOrRegister: 'Login / Register',
        usernamePlaceholder: 'Please enter user name / email',
        phonePlaceholder: 'Please enter phone number',
        codePlaceholder: 'Please enter verification code',
        passwordPlaceholder: 'Please enter password',
        confirmPasswordPlaceholder: 'Please enter password again',
        emailPlaceholder: 'Please enter email(QQ)',
        codeLogin: 'Verification code login',
        confirm: 'Confirm',
        back: 'Back',
        validateSuccess: 'Verification passed',
        registerSuccess: 'Registration successful，Starting to log in',
        loginSuccess: 'Login successfully',
        welcomeBack: 'Welcome back, {username} !'
      },
      pwdLogin: {
        title: 'Password Login',
        rememberMe: 'Remember me',
        forgetPassword: 'Forget password?',
        register: 'Register',
        otherAccountLogin: 'Other Account Login',
        otherLoginMode: 'Other Login Mode',
        superAdmin: 'Super Admin',
        admin: 'Admin',
        user: 'User'
      },
      codeLogin: {
        title: 'Verification Code Login',
        getCode: 'Get verification code',
        reGetCode: 'Reacquire after {time}s',
        sendCodeSuccess: 'Verification code sent successfully',
        imageCodePlaceholder: 'Please enter image verification code'
      },
      register: {
        title: 'Register',
        agreement: 'I have read and agree to',
        protocol: '《User Agreement》',
        policy: '《Privacy Policy》'
      },
      resetPwd: {
        title: 'Reset Password'
      },
      bindWeChat: {
        title: 'Bind WeChat'
      }
    },
    about: {
      title: 'About',
      introduction: `Vue3NaiveAdmin is an elegant and powerful admin template, based on the latest front-end technology stack, including Vue3, Vite5, TypeScript, Pinia and UnoCSS. It has built-in rich theme configuration and components, strict code specifications, and an automated file routing system. In addition, it also integrates with the NestAdmin backend management framework based on Nestjs. Vue3NaiveAdmin provides you with a one-stop admin solution, no additional configuration, and out of the box. It is also a best practice for learning cutting-edge technologies quickly.`,
      projectInfo: {
        title: 'Project Info',
        version: 'Version',
        latestBuildTime: 'Latest Build Time',
        githubLink: 'Github Link',
        previewLink: 'Preview Link'
      },
      prdDep: 'Production Dependency',
      devDep: 'Development Dependency'
    },
    home: {
      greeting: '{nickName}, Today is another beautiful day!',
      noticeCount: 'Notice Count',
      notice: 'Notice',
      todo: 'Todo',
      message: 'Message',
      goods: 'Goods Count',
      registerCount: 'Register Count',
      schedule: 'Work and rest Schedule',
      study: 'Study',
      work: 'Work',
      rest: 'Rest',
      entertainment: 'Entertainment',
      visitCount: 'Visit Count',
      online: 'Online',
      dealCount: 'Deal Count',
      creativity: 'Creativity'
    },
    manage: {
      common: {
        status: {
          enable: 'Enable',
          disable: 'Disable'
        },
        order: 'Order',
        default: 'Default',
        remark: 'Remark'
      },
      dept: {
        title: 'Dept',
        name: 'Dept Name',
        default: 'Default Dept',
        add: 'Add Dept',
        edit: 'Edit Dept',
        parent: 'Parent Dept',
        searchPlaceholder: 'Please input deptName'
      },
      role: {
        title: 'Role List',
        name: 'Role Name',
        value: 'Role Value',
        status: 'Role Status',
        desc: 'Role Description',
        add: 'Add Role',
        edit: 'Edit Role',
        default: 'Default Role',
        menus: 'Menu',
        valueErrorMessage:
          'Character values can only contain English letters, numbers, underscores, and horizontal lines',
        detail: 'Role Detail',
        checkChildNodeTip: 'Whether or not check all child nodes'
      },
      user: {
        title: 'User List',
        username: 'User Name',
        avatar: 'Avatar',
        userGender: 'Gender',
        nickName: 'Nick Name',
        phone: 'Phone',
        email: 'Email',
        role: 'User Roles',
        add: 'Add User',
        edit: 'Edit User',
        resetPassword: 'Reset Password',
        dept: 'Department',
        address: 'Address',
        birthDate: 'Birth Date',
        signature: 'Signature',
        introduction: 'Introduction',
        gender: {
          male: 'Male',
          female: 'Female'
        },
        detail: 'User Detail'
      },
      menu: {
        home: 'Home',
        title: 'Menu Name',
        parent: 'Parent Menu',
        menuType: 'Menu Type',
        menuName: 'Menu Name',
        routeName: 'Route Name',
        component: 'Component Address',
        permission: 'Permission',
        routePath: 'Menu Path',
        pathParam: 'Path Param',
        layout: 'Layout Component',
        page: 'Page Component',
        i18nKey: 'I18n Key',
        icon: 'Icon',
        localIcon: 'Local Icon',
        iconTypeTitle: 'Icon Type',
        order: 'Order',
        constant: 'Constant',
        keepAlive: 'Keep Alive',
        hideInMenu: 'Hide In Menu',
        activeMenu: 'Active Menu',
        isExt: 'Is External',
        extOpenMode: 'External Link Open Mode',
        href: 'Href Address',
        black: 'Open a new window',
        inner: 'Embedded page open',
        multiTab: 'Multi Tab',
        fixedIndexInTab: 'Fixed Index In Tab',
        query: 'Query Params',
        add: 'Add Menu',
        edit: 'Edit Menu',
        detail: 'Menu Detail',
        addChildMenu: 'Add Child Menu',
        addPermission: 'Add Permission',
        type: {
          directory: 'Directory',
          menu: 'Menu',
          permission: 'Permission'
        },
        iconType: {
          iconify: 'Iconify Icon',
          local: 'Local Icon'
        }
      },
      online: {
        ip: 'IP',
        sessionId: 'Session Id',
        browser: 'Browser',
        os: 'OS',
        loginTime: 'Login Time',
        offline: 'Offline',
        address: 'Login Address'
      },
      loginLog: {
        browser: 'Browser',
        os: 'OS',
        loginTime: 'Login Time',
        address: 'Login Address'
      },
      captchaLog: {
        captcha: 'Captcha',
        provider: 'Provider',
        sendTime: 'Send Time',
        account: 'Account'
      },
      os: {
        runtime: {
          title: 'Runtime',
          os: 'OS',
          arch: 'Arch',
          nodeVersion: 'Node Version',
          npmVersion: 'Npm Version'
        },
        disk: {
          title: 'Disk',
          total: 'Total Space',
          used: 'Used Space',
          available: 'Available Space'
        },
        cpu: {
          title: 'Cpu',
          details: 'Details',
          cores: 'Cores',
          coresLoad: 'Cores Load'
        },
        memory: {
          title: 'Memory',
          total: 'Total Memory',
          available: 'Available Memory',
          active: 'Used Memory'
        }
      },
      parameter: {
        name: 'Parameter Name',
        key: 'Parameter Key',
        value: 'Parameter Value',
        add: 'Add Parameter',
        edit: 'Edit Parameter'
      },
      task: {
        name: 'task Name',
        service: 'service',
        params: 'params',
        cron: 'Cron',
        interval: 'Interval',
        limit: 'Limit',
        startTime: 'Start Time',
        endTime: 'End Time',
        add: 'Add Task',
        edit: 'Edit Task',
        start: 'Start',
        stop: 'Stop',
        once: 'Once',
        delete: 'Delete',
        detail: 'Task Details',
        taskType: 'Type',
        type: {
          cron: 'Cron',
          interval: 'Interval'
        }
      },
      taskLog: {
        id: 'Task ID',
        name: 'Task Name',
        consume: 'Consume Time',
        failDetail: 'Fail Detail',
        startTime: 'Start Time'
      },
      captcha: {
        provider: {
          email: 'Email',
          sms: 'Sms',
          captcha: 'Captcha'
        }
      },
      dict: {
        name: 'Name',
        code: 'Code',
        label: 'Label',
        value: 'Value',
        dictItem: {
          currentTypeName: 'Current Type Name',
          add: 'Add DictItem',
          edit: 'Edit DictItem'
        },
        dictType: {
          title: 'DictType',
          add: 'Add DictType',
          edit: 'Edit DictType'
        }
      },
      cache: {
        list: 'Cache List',
        keyList: 'Cache Key List',
        content: 'Cache Content',
        prefix: 'Cache Prefix',
        name: 'Cache Name',
        key: 'Cache Key',
        value: 'Cache Value'
      },
      notice: {
        name: 'Notice Title',
        content: 'Notice Content',
        type: 'Notice Type',
        add: 'Add Notice',
        edit: 'Edit Notice',
        detail: 'Notice Detail'
      }
    },
    tools: {
      mail: {
        subject: 'Subject',
        email: 'Email',
        content: 'Content',
        sendSuccess: 'Send Success',
        pleaseEnterCorrectEmail: 'Please enter the correct email',
        to: 'Receiver',
        toPlaceholder: 'Please enter the recipient email',
        subjectPlaceholder: 'Please enter the subject',
        send: 'Send'
      },
      storage: {
        fileName: 'File Name',
        fileExt: 'File Ext',
        fileType: 'File Type',
        preview: 'Preview',
        size: 'Size',
        uploadTime: 'Upload Time',
        uploadBy: 'UploadBy',
        lastModified: 'last Modified',
        path: 'Path'
      },
      sql: {
        export: 'Export Sql File',
        import: 'Import Sql File',
        importSuccess: 'Import Success',
        importFileTypeTip: 'Only support .sql file',
        importFile: 'Import File',
        importFilePlaceholder: 'Please select the Sql file',
        exportTip:
          'When it is inconvenient for you to export the SQL file of the project on the server, you can use this method to export the SQL file',
        importWarningTip:
          'When it is inconvenient for you to import SQL files on the server, you can use this method to import SQL files',
        importDangerTip:
          'You must be clear about what you are doing when importing tables or structures. This method is more aggressive and it is recommended to use Migration'
      }
    },
    userCenter: {
      details: 'Personal Information ',
      editInfo: 'Edit Personal Information',
      editPwd: 'Edit Password'
    },
    password: {
      oldPwd: 'Old Password',
      newPwd: 'New Password',
      confirmNewPwd: 'Confirm New Password',
      pleaseTwice: 'Please enter the new password again',
      confirmPwd: {
        required: 'Please enter new password again',
        invalid: 'The two passwords are inconsistent'
      }
    }
  },
  form: {
    required: 'Cannot be empty',
    username: {
      required: 'Please enter user name',
      invalid: 'User name format is incorrect'
    },
    phone: {
      required: 'Please enter phone number',
      invalid: 'Phone number format is incorrect'
    },
    pwd: {
      required: 'Please enter password',
      invalid: '6-18 characters, including letters, numbers, and special characters'
    },
    confirmPwd: {
      required: 'Please enter password again',
      invalid: 'The two passwords are inconsistent'
    },
    code: {
      required: 'Please enter verification code',
      invalid: 'Verification code format is incorrect'
    },
    email: {
      required: 'Please enter email',
      invalid: 'Email format is incorrect'
    }
  },
  dropdown: {
    closeCurrent: 'Close Current',
    closeOther: 'Close Other',
    closeLeft: 'Close Left',
    closeRight: 'Close Right',
    closeAll: 'Close All'
  },
  icon: {
    themeConfig: 'Theme Configuration',
    themeSchema: 'Theme Schema',
    lang: 'Switch Language',
    fullscreen: 'Fullscreen',
    fullscreenExit: 'Exit Fullscreen',
    reload: 'Reload Page',
    collapse: 'Collapse Menu',
    expand: 'Expand Menu',
    pin: 'Pin',
    unpin: 'Unpin'
  },
  datatable: {
    itemCount: 'Total {total} items'
  }
};

export default local;
