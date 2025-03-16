const local: App.I18n.Schema = {
  system: {
    title: 'Nest+Vue3 管理系统',
    updateTitle: '系统版本更新通知',
    updateContent: '检测到系统有新版本发布，是否立即刷新页面？',
    updateConfirm: '立即刷新',
    updateCancel: '稍后再说'
  },
  common: {
    action: '操作',
    add: '新增',
    addSuccess: '添加成功',
    backToHome: '返回首页',
    batchDelete: '批量删除',
    batchDisable: '批量禁用',
    enable: '启用',
    disable: '禁用',
    status: '状态',
    cancel: '取消',
    close: '关闭',
    check: '勾选',
    expandColumn: '展开列',
    columnSetting: '列设置',
    config: '配置',
    confirm: '确认',
    delete: '删除',
    deleteSuccess: '删除成功',
    confirmDelete: '确认删除吗？',
    edit: '编辑',
    expand: '展开',
    fold: '折叠',
    warning: '警告',
    error: '错误',
    index: '序号',
    keywordSearch: '请输入关键词搜索',
    logout: '退出登录',
    logoutConfirm: '确认退出登录吗？',
    lookForward: '敬请期待',
    modify: '修改',
    modifySuccess: '修改成功',
    noData: '无数据',
    operate: '操作',
    pleaseCheckValue: '请检查输入的值是否合法',
    refresh: '刷新',
    reset: '重置',
    search: '搜索',
    switch: '切换',
    tip: '提示',
    trigger: '触发',
    update: '更新',
    updateSuccess: '更新成功',
    userCenter: '个人中心',
    yesOrNo: {
      yes: '是',
      no: '否'
    },
    successOrFailRecord: {
      success: '成功',
      fail: '失败'
    },
    setDefault: '设为默认',
    noPermission: '非常抱歉，您没有权限！',
    pleaseEnter: '请输入',
    pleaseSelect: '请选择',
    createdAt: '创建时间',
    updatedAt: '更新时间',
    operateSuccess: '操作成功',
    resetSuccess: '重置成功'
  },
  request: {
    logout: '请求失败后登出用户',
    logoutMsg: '用户状态失效，请重新登录',
    logoutWithModal: '请求失败后弹出模态框再登出用户',
    logoutWithModalMsg: '用户状态失效，请重新登录',
    refreshToken: '请求的token已过期，刷新token',
    tokenExpired: 'token已过期'
  },
  theme: {
    themeSchema: {
      title: '主题模式',
      light: '亮色模式',
      dark: '暗黑模式',
      auto: '跟随系统'
    },
    grayscale: '灰色模式',
    colourWeakness: '色弱模式',
    layoutMode: {
      title: '布局模式',
      vertical: '左侧菜单模式',
      'vertical-mix': '左侧菜单混合模式',
      horizontal: '顶部菜单模式',
      'horizontal-mix': '顶部菜单混合模式',
      reverseHorizontalMix: '一级菜单与子级菜单位置反转'
    },
    recommendColor: '应用推荐算法的颜色',
    recommendColorDesc: '推荐颜色的算法参照',
    themeColor: {
      title: '主题颜色',
      primary: '主色',
      info: '信息色',
      success: '成功色',
      warning: '警告色',
      error: '错误色',
      followPrimary: '跟随主色'
    },
    scrollMode: {
      title: '滚动模式',
      wrapper: '外层滚动',
      content: '主体滚动'
    },
    page: {
      animate: '页面切换动画',
      mode: {
        title: '页面切换动画类型',
        'fade-slide': '滑动',
        fade: '淡入淡出',
        'fade-bottom': '底部消退',
        'fade-scale': '缩放消退',
        'zoom-fade': '渐变',
        'zoom-out': '闪现',
        none: '无'
      }
    },
    fixedHeaderAndTab: '固定头部和标签栏',
    header: {
      height: '头部高度',
      breadcrumb: {
        visible: '显示面包屑',
        showIcon: '显示面包屑图标'
      },
      multilingual: {
        visible: '显示多语言按钮'
      }
    },
    tab: {
      visible: '显示标签栏',
      cache: '标签栏信息缓存',
      height: '标签栏高度',
      mode: {
        title: '标签栏风格',
        chrome: '谷歌风格',
        button: '按钮风格'
      }
    },
    sider: {
      inverted: '深色侧边栏',
      width: '侧边栏宽度',
      collapsedWidth: '侧边栏折叠宽度',
      mixWidth: '混合布局侧边栏宽度',
      mixCollapsedWidth: '混合布局侧边栏折叠宽度',
      mixChildMenuWidth: '混合布局子菜单宽度'
    },
    footer: {
      visible: '显示底部',
      fixed: '固定底部',
      height: '底部高度',
      right: '底部局右'
    },
    watermark: {
      visible: '显示全屏水印',
      text: '水印文本'
    },
    themeDrawerTitle: '主题配置',
    pageFunTitle: '页面功能',
    resetCacheStrategy: {
      title: '重置缓存策略',
      close: '关闭页面',
      refresh: '刷新页面'
    },
    configOperation: {
      copyConfig: '复制配置',
      copySuccessMsg: '复制成功，请替换 src/theme/settings.ts 中的变量 themeSettings',
      resetConfig: '重置配置',
      resetSuccessMsg: '重置成功'
    }
  },
  route: {
    login: '登录',
    403: '无权限',
    404: '页面不存在',
    500: '服务器错误',
    'iframe-page': '外链页面',
    home: '首页',
    document: '文档',
    document_project: '项目文档',
    'document_project-link': '项目文档(外链)',
    document_vue: 'Vue文档',
    document_vite: 'Vite文档',
    document_unocss: 'UnoCSS文档',
    document_naive: 'Naive UI文档',
    document_antd: 'Ant Design Vue文档',
    'user-center': '个人中心',
    about: '关于',
    system: '系统管理',
    system_role: '角色管理',
    system_user: '用户管理',
    system_dept: '部门管理',
    system_menu: '菜单管理',
    system_parameter: '参数管理',
    system_schedule: '任务调度',
    system_schedule_task: '定时任务',
    'system_schedule_task-log': '任务日志',
    'system_monitor_captcha-log': '验证码日志',
    system_monitor: '系统监控',
    system_monitor_online: '在线用户',
    'system_monitor_login-log': '登录日志',
    system_monitor_serve: '服务监控',
    tools: '系统工具',
    tools_storage: '存储管理',
    tools_storage_local: '本地存储',
    tools_storage_oss: 'Oss存储',
    tools_mail: '发送邮件',
    exception: '异常页',
    exception_403: '403',
    exception_404: '404',
    exception_500: '500',
    plugin: '插件示例',
    plugin_copy: '剪贴板',
    plugin_charts: '图表',
    plugin_charts_echarts: 'ECharts',
    plugin_charts_antv: 'AntV',
    plugin_charts_vchart: 'VChart',
    plugin_editor: '编辑器',
    plugin_editor_quill: '富文本编辑器',
    plugin_editor_markdown: 'MD 编辑器',
    plugin_icon: '图标',
    plugin_map: '地图',
    plugin_print: '打印',
    plugin_swiper: 'Swiper',
    plugin_video: '视频',
    plugin_barcode: '条形码',
    plugin_pinyin: '拼音',
    plugin_excel: 'Excel',
    plugin_pdf: 'PDF 预览',
    plugin_gantt: '甘特图',
    plugin_gantt_dhtmlx: 'dhtmlxGantt',
    plugin_gantt_vtable: 'VTableGantt',
    plugin_typeit: '打字机',
    plugin_tables: '表格',
    plugin_tables_vtable: 'VTable'
  },
  page: {
    login: {
      common: {
        loginOrRegister: '登录 / 注册',
        usernamePlaceholder: '请输入用户名 / 邮箱',
        phonePlaceholder: '请输入手机号码',
        codePlaceholder: '请输入验证码',
        passwordPlaceholder: '请输入密码',
        confirmPasswordPlaceholder: '请再次输入密码',
        emailPlaceholder: '请输入邮箱(QQ)',
        codeLogin: '验证码登录',
        confirm: '确定',
        back: '返回',
        validateSuccess: '验证成功',
        registerSuccess: '注册成功，快去登录吧',
        loginSuccess: '登录成功',
        welcomeBack: '欢迎回来，{username} ！'
      },
      pwdLogin: {
        title: '密码登录',
        rememberMe: '记住我',
        forgetPassword: '忘记密码？',
        register: '注册账号',
        otherAccountLogin: '其他账号登录',
        otherLoginMode: '其他登录方式',
        superAdmin: '超级管理员',
        admin: '管理员',
        user: '普通用户'
      },
      codeLogin: {
        title: '验证码登录',
        getCode: '获取验证码',
        reGetCode: '{time}秒后重新获取',
        sendCodeSuccess: '验证码发送成功',
        imageCodePlaceholder: '请输入图片验证码'
      },
      register: {
        title: '注册账号',
        agreement: '我已经仔细阅读并接受',
        protocol: '《用户协议》',
        policy: '《隐私权政策》'
      },
      resetPwd: {
        title: '重置密码'
      },
      bindWeChat: {
        title: '绑定微信'
      },
      superLogin: {
        title: '超级管理员登录'
      }
    },
    about: {
      title: '关于',
      introduction: `Nest+Vue Admin 是一个优雅且功能强大的后台管理模板，基于最新的前端技术栈，包括 Vue3, Vite5, TypeScript, Pinia 和 UnoCSS。它内置了丰富的主题配置和组件，代码规范严谨，实现了自动化的文件路由系统。此外，它还采用了基于 ApiFox 的在线Mock数据方案。Nest+Vue Admin 为您提供了一站式的后台管理解决方案，无需额外配置，开箱即用。同样是一个快速学习前沿技术的最佳实践。`,
      projectInfo: {
        title: '项目信息',
        version: '版本',
        latestBuildTime: '最新构建时间',
        githubLink: 'Github 地址',
        previewLink: '预览地址'
      },
      prdDep: '生产依赖',
      devDep: '开发依赖'
    },
    home: {
      branchDesc:
        '为了方便大家开发和更新合并，我们对main分支的代码进行了精简，只保留了首页菜单，其余内容已移至example分支进行维护。预览地址显示的内容即为example分支的内容。',
      greeting: '早安，{nickName}, 今天又是充满活力的一天!',
      weatherDesc: '今日多云转晴，20℃ - 25℃!',
      projectCount: '项目数',
      todo: '待办',
      message: '消息',
      goods: '商品数量',
      registerCount: '注册量',
      schedule: '作息安排',
      study: '学习',
      work: '工作',
      rest: '休息',
      entertainment: '娱乐',
      visitCount: '访问量',
      online: '在线人数',
      dealCount: '成交量',
      projectNews: {
        title: '项目动态',
        moreNews: '更多动态',
        desc1: '小张在2024年12月24日创建了开源项目 Nest+Vue Admin !',
        desc2: '小张在2024年12月24日提交了第一个 commit !',
        desc3: '小张在2025年03月02日 完成了前后端的功能对接 !',
        desc4: '小张目前正在对项目进行 测试和Bug 修复工作 !',
        desc5: '截至2025年03月12日 小张优化了菜单和后端的对接，也完成了Docker的部署 !',
        desc6: '小张后续要需要完善项目的国际化，详情组件、增加websocket、项目README文档编写......'
      },
      creativity: '创意'
    },
    manage: {
      common: {
        status: {
          enable: '启用',
          disable: '禁用'
        },
        order: '排序',
        default: '默认',
        remark: '备注'
      },
      dept: {
        title: '部门',
        name: '部门名称',
        default: '默认部门',
        form: null,
        add: '新增部门',
        edit: '编辑部门',
        parent: '上级部门',
        searchPlaceholder: '请输入部门名称'
      },
      role: {
        title: '角色列表',
        name: '角色名称',
        value: '角色值',
        status: '角色状态',
        desc: '角色描述',
        add: '新增角色',
        edit: '编辑角色',
        default: '默认角色',
        menus: '菜单权限',
        valueErrorMessage: '角色值仅仅能包含英文字母、数字、下划线、横线',
        detail: '角色详情'
      },
      user: {
        title: '用户列表',
        username: '用户名',
        avatar: '头像',
        userGender: '性别',
        nickName: '昵称',
        phone: '手机号码',
        email: '邮箱',
        role: ' 用户角色',
        add: '新增用户',
        edit: '编辑用户',
        resetPassword: '重置密码',
        dept: '所属部门',
        address: '地址',
        birthDate: '生日',
        signature: '个性签名',
        introduction: '个人介绍',
        gender: {
          male: '男',
          female: '女'
        }
      },
      menu: {
        home: '首页',
        title: '菜单名称',
        parent: '上级菜单',
        menuType: '菜单类型',
        menuName: '菜单名称',
        routeName: '路由名称',
        routePath: '菜单路径',
        component: '组件地址',
        permission: '权限标识',
        pathParam: '路径参数',
        layout: '布局',
        page: '页面组件',
        i18nKey: '国际化key',
        icon: '图标',
        localIcon: '本地图标',
        iconTypeTitle: '图标类型',
        order: '排序',
        constant: '常量路由',
        keepAlive: '缓存路由',
        hideInMenu: '隐藏菜单',
        activeMenu: '高亮的菜单',
        isExt: '是否外链',
        extOpenMode: '外链打开方式',
        black: '新窗口打开',
        inner: '内嵌页打开',
        href: '外链地址',
        multiTab: '支持多页签',
        fixedIndexInTab: '固定在页签中的序号',
        query: '路由参数',
        add: '新增菜单',
        edit: '编辑菜单',
        detail: '菜单详情',
        addChildMenu: '新增子菜单',
        addPermission: '新增权限',
        type: {
          directory: '目录',
          menu: '菜单',
          permission: '权限'
        },
        iconType: {
          iconify: 'iconify图标',
          local: '本地图标'
        }
      },
      online: {
        ip: 'IP',
        sessionId: '会话编号',
        browser: '浏览器',
        os: '操作系统',
        loginTime: '登录时间',
        offline: '下线',
        address: '登录地址'
      },
      loginLog: {
        browser: '浏览器',
        os: '操作系统',
        loginTime: '登录时间',
        address: '登录地址'
      },
      captchaLog: {
        captcha: '验证码',
        provider: '验证码提供商',
        sendTime: '发送时间',
        account: '账户'
      },
      os: {
        runtime: {
          title: '运行环境',
          os: '操作系统',
          arch: '系统架构',
          nodeVersion: 'Node 版本',
          npmVersion: 'Npm 版本'
        },
        disk: {
          title: '磁盘',
          total: '总空间',
          used: '已用空间',
          available: '可用空间'
        },
        cpu: {
          title: 'Cpu',
          details: '详细',
          cores: '核心',
          coresLoad: '负载'
        },
        memory: {
          title: '内存',
          total: '总内存',
          available: '可用内存',
          active: '已用内存'
        }
      },
      parameter: {
        name: '参数名称',
        key: '参数键',
        value: '参数值',
        add: '新增参数',
        edit: '编辑参数'
      },
      task: {
        name: '任务名称',
        service: '调用服务',
        params: '执行参数',
        cron: 'Cron 表达式',
        interval: '间隔时间',
        limit: '执行次数',
        startTime: '开始时间',
        endTime: '结束时间',
        add: '新增任务',
        edit: '修编辑任务',
        start: '启动',
        stop: '停止',
        once: '启动一次',
        delete: '删除',
        detail: '任务详情',
        taskType: '类型',
        type: {
          cron: 'Cron',
          interval: '间隔'
        }
      },
      taskLog: {
        id: '任务ID',
        name: '任务名称',
        consume: '耗时',
        failDetail: '失败详情',
        startTime: '任务发起时间'
      },
      captcha: {
        provider: {
          email: '邮件',
          sms: '短信',
          captcha: 'Captcha'
        }
      }
    },
    tools: {
      mail: {
        subject: '邮件主题',
        email: '邮箱',
        content: '正文',
        sendSuccess: '发送成功',
        pleaseEnterCorrectEmail: '请输入正确的邮箱地址',
        to: '收件人',
        toPlaceholder: '请输入收件人邮箱地址',
        subjectPlaceholder: '请输入邮件主题',
        send: '发送'
      },
      storage: {
        fileName: '文件名',
        fileExt: '文件扩展名',
        fileType: '文件类型',
        preview: '缩略图',
        size: '文件大小',
        uploadTime: '上传时间',
        uploadBy: '上传者',
        lastModified: '最近更新时间',
        path: '访问路径'
      }
    }
  },
  form: {
    required: '不能为空',
    username: {
      required: '请输入用户名',
      invalid: '用户名格式不正确'
    },
    phone: {
      required: '请输入手机号码',
      invalid: '手机号码格式不正确'
    },
    pwd: {
      required: '请输入密码',
      invalid: '密码格式不正确，6-18位字符，包含字母、数字、特殊字符'
    },
    confirmPwd: {
      required: '请输入确认密码',
      invalid: '两次输入密码不一致'
    },
    code: {
      required: '请输入验证码',
      invalid: '验证码格式不正确'
    },
    email: {
      required: '请输入邮箱',
      invalid: '邮箱格式不正确'
    }
  },
  dropdown: {
    closeCurrent: '关闭',
    closeOther: '关闭其它',
    closeLeft: '关闭左侧',
    closeRight: '关闭右侧',
    closeAll: '关闭所有'
  },
  icon: {
    themeConfig: '主题配置',
    themeSchema: '主题模式',
    lang: '切换语言',
    fullscreen: '全屏',
    fullscreenExit: '退出全屏',
    reload: '刷新页面',
    collapse: '折叠菜单',
    expand: '展开菜单',
    pin: '固定',
    unpin: '取消固定'
  },
  datatable: {
    itemCount: '共 {total} 条'
  }
};

export default local;
