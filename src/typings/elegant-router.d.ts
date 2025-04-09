/* eslint-disable */
/* prettier-ignore */
// Generated by elegant-router
// Read more: https://github.com/soybeanjs/elegant-router

declare module "@elegant-router/types" {
  type ElegantConstRoute = import('@elegant-router/vue').ElegantConstRoute;

  /**
   * route layout
   */
  export type RouteLayout = "base" | "blank";

  /**
   * route map
   */
  export type RouteMap = {
    "root": "/";
    "not-found": "/:pathMatch(.*)*";
    "exception": "/exception";
    "exception_403": "/exception/403";
    "exception_404": "/exception/404";
    "exception_500": "/exception/500";
    "document": "/document";
    "document_project": "/document/project";
    "document_project-link": "/document/project-link";
    "document_vue": "/document/vue";
    "document_vite": "/document/vite";
    "document_unocss": "/document/unocss";
    "document_naive": "/document/naive";
    "document_antd": "/document/antd";
    "blog": "/blog";
    "blog_zym": "/blog/zym";
    "blog_zym-href": "/blog/zym-href";
    "403": "/403";
    "404": "/404";
    "500": "/500";
    "about": "/about";
    "home": "/home";
    "iframe-page": "/iframe-page/:url";
    "login": "/login/:module(pwd-login|code-login|register|reset-pwd|bind-wechat)?";
    "plugin": "/plugin";
    "plugin_barcode": "/plugin/barcode";
    "plugin_charts": "/plugin/charts";
    "plugin_charts_antv": "/plugin/charts/antv";
    "plugin_charts_echarts": "/plugin/charts/echarts";
    "plugin_charts_vchart": "/plugin/charts/vchart";
    "plugin_copy": "/plugin/copy";
    "plugin_editor": "/plugin/editor";
    "plugin_editor_markdown": "/plugin/editor/markdown";
    "plugin_editor_quill": "/plugin/editor/quill";
    "plugin_excel": "/plugin/excel";
    "plugin_gantt": "/plugin/gantt";
    "plugin_gantt_dhtmlx": "/plugin/gantt/dhtmlx";
    "plugin_gantt_vtable": "/plugin/gantt/vtable";
    "plugin_icon": "/plugin/icon";
    "plugin_map": "/plugin/map";
    "plugin_pdf": "/plugin/pdf";
    "plugin_pinyin": "/plugin/pinyin";
    "plugin_print": "/plugin/print";
    "plugin_swiper": "/plugin/swiper";
    "plugin_tables": "/plugin/tables";
    "plugin_tables_vtable": "/plugin/tables/vtable";
    "plugin_typeit": "/plugin/typeit";
    "plugin_video": "/plugin/video";
    "system": "/system";
    "system_dept": "/system/dept";
    "system_dict": "/system/dict";
    "system_menu": "/system/menu";
    "system_monitor": "/system/monitor";
    "system_monitor_cache": "/system/monitor/cache";
    "system_monitor_captcha-log": "/system/monitor/captcha-log";
    "system_monitor_login-log": "/system/monitor/login-log";
    "system_monitor_online": "/system/monitor/online";
    "system_monitor_serve": "/system/monitor/serve";
    "system_parameter": "/system/parameter";
    "system_role": "/system/role";
    "system_schedule": "/system/schedule";
    "system_schedule_task": "/system/schedule/task";
    "system_schedule_task-log": "/system/schedule/task-log";
    "system_user": "/system/user";
    "tools": "/tools";
    "tools_mail": "/tools/mail";
    "tools_sql": "/tools/sql";
    "tools_storage": "/tools/storage";
    "tools_storage_local": "/tools/storage/local";
    "tools_storage_oss": "/tools/storage/oss";
    "user-center": "/user-center";
  };

  /**
   * route key
   */
  export type RouteKey = keyof RouteMap;

  /**
   * route path
   */
  export type RoutePath = RouteMap[RouteKey];

  /**
   * custom route key
   */
  export type CustomRouteKey = Extract<
    RouteKey,
    | "root"
    | "not-found"
    | "exception"
    | "exception_403"
    | "exception_404"
    | "exception_500"
    | "document"
    | "document_project"
    | "document_project-link"
    | "document_vue"
    | "document_vite"
    | "document_unocss"
    | "document_naive"
    | "document_antd"
    | "blog"
    | "blog_zym"
    | "blog_zym-href"
  >;

  /**
   * the generated route key
   */
  export type GeneratedRouteKey = Exclude<RouteKey, CustomRouteKey>;

  /**
   * the first level route key, which contain the layout of the route
   */
  export type FirstLevelRouteKey = Extract<
    RouteKey,
    | "403"
    | "404"
    | "500"
    | "about"
    | "home"
    | "iframe-page"
    | "login"
    | "plugin"
    | "system"
    | "tools"
    | "user-center"
  >;

  /**
   * the custom first level route key
   */
  export type CustomFirstLevelRouteKey = Extract<
    CustomRouteKey,
    | "root"
    | "not-found"
    | "exception"
    | "document"
    | "blog"
  >;

  /**
   * the last level route key, which has the page file
   */
  export type LastLevelRouteKey = Extract<
    RouteKey,
    | "403"
    | "404"
    | "500"
    | "iframe-page"
    | "login"
    | "about"
    | "home"
    | "plugin_barcode"
    | "plugin_charts_antv"
    | "plugin_charts_echarts"
    | "plugin_charts_vchart"
    | "plugin_copy"
    | "plugin_editor_markdown"
    | "plugin_editor_quill"
    | "plugin_excel"
    | "plugin_gantt_dhtmlx"
    | "plugin_gantt_vtable"
    | "plugin_icon"
    | "plugin_map"
    | "plugin_pdf"
    | "plugin_pinyin"
    | "plugin_print"
    | "plugin_swiper"
    | "plugin_tables_vtable"
    | "plugin_typeit"
    | "plugin_video"
    | "system_dept"
    | "system_dict"
    | "system_menu"
    | "system_monitor_cache"
    | "system_monitor_captcha-log"
    | "system_monitor_login-log"
    | "system_monitor_online"
    | "system_monitor_serve"
    | "system_parameter"
    | "system_role"
    | "system_schedule_task-log"
    | "system_schedule_task"
    | "system_user"
    | "tools_mail"
    | "tools_sql"
    | "tools_storage_local"
    | "tools_storage_oss"
    | "user-center"
  >;

  /**
   * the custom last level route key
   */
  export type CustomLastLevelRouteKey = Extract<
    CustomRouteKey,
    | "root"
    | "not-found"
    | "exception_403"
    | "exception_404"
    | "exception_500"
    | "document_project"
    | "document_project-link"
    | "document_vue"
    | "document_vite"
    | "document_unocss"
    | "document_naive"
    | "document_antd"
    | "blog_zym"
    | "blog_zym-href"
  >;

  /**
   * the single level route key
   */
  export type SingleLevelRouteKey = FirstLevelRouteKey & LastLevelRouteKey;

  /**
   * the custom single level route key
   */
  export type CustomSingleLevelRouteKey = CustomFirstLevelRouteKey & CustomLastLevelRouteKey;

  /**
   * the first level route key, but not the single level
  */
  export type FirstLevelRouteNotSingleKey = Exclude<FirstLevelRouteKey, SingleLevelRouteKey>;

  /**
   * the custom first level route key, but not the single level
   */
  export type CustomFirstLevelRouteNotSingleKey = Exclude<CustomFirstLevelRouteKey, CustomSingleLevelRouteKey>;

  /**
   * the center level route key
   */
  export type CenterLevelRouteKey = Exclude<GeneratedRouteKey, FirstLevelRouteKey | LastLevelRouteKey>;

  /**
   * the custom center level route key
   */
  export type CustomCenterLevelRouteKey = Exclude<CustomRouteKey, CustomFirstLevelRouteKey | CustomLastLevelRouteKey>;

  /**
   * the center level route key
   */
  type GetChildRouteKey<K extends RouteKey, T extends RouteKey = RouteKey> = T extends `${K}_${infer R}`
    ? R extends `${string}_${string}`
      ? never
      : T
    : never;

  /**
   * the single level route
   */
  type SingleLevelRoute<K extends SingleLevelRouteKey = SingleLevelRouteKey> = K extends string
    ? Omit<ElegantConstRoute, 'children'> & {
        name: K;
        path: RouteMap[K];
        component: `layout.${RouteLayout}$view.${K}`;
      }
    : never;

  /**
   * the last level route
   */
  type LastLevelRoute<K extends GeneratedRouteKey> = K extends LastLevelRouteKey
    ? Omit<ElegantConstRoute, 'children'> & {
        name: K;
        path: RouteMap[K];
        component: `view.${K}`;
      }
    : never;
  
  /**
   * the center level route
   */
  type CenterLevelRoute<K extends GeneratedRouteKey> = K extends CenterLevelRouteKey
    ? Omit<ElegantConstRoute, 'component'> & {
        name: K;
        path: RouteMap[K];
        children: (CenterLevelRoute<GetChildRouteKey<K>> | LastLevelRoute<GetChildRouteKey<K>>)[];
      }
    : never;

  /**
   * the multi level route
   */
  type MultiLevelRoute<K extends FirstLevelRouteNotSingleKey = FirstLevelRouteNotSingleKey> = K extends string
    ? ElegantConstRoute & {
        name: K;
        path: RouteMap[K];
        component: `layout.${RouteLayout}`;
        children: (CenterLevelRoute<GetChildRouteKey<K>> | LastLevelRoute<GetChildRouteKey<K>>)[];
      }
    : never;
  
  /**
   * the custom first level route
   */
  type CustomSingleLevelRoute<K extends CustomFirstLevelRouteKey = CustomFirstLevelRouteKey> = K extends string
    ? Omit<ElegantConstRoute, 'children'> & {
        name: K;
        path: RouteMap[K];
        component?: `layout.${RouteLayout}$view.${LastLevelRouteKey}`;
      }
    : never;

  /**
   * the custom last level route
   */
  type CustomLastLevelRoute<K extends CustomRouteKey> = K extends CustomLastLevelRouteKey
    ? Omit<ElegantConstRoute, 'children'> & {
        name: K;
        path: RouteMap[K];
        component?: `view.${LastLevelRouteKey}`;
      }
    : never;

  /**
   * the custom center level route
   */
  type CustomCenterLevelRoute<K extends CustomRouteKey> = K extends CustomCenterLevelRouteKey
    ? Omit<ElegantConstRoute, 'component'> & {
        name: K;
        path: RouteMap[K];
        children: (CustomCenterLevelRoute<GetChildRouteKey<K>> | CustomLastLevelRoute<GetChildRouteKey<K>>)[];
      }
    : never;

  /**
   * the custom multi level route
   */
  type CustomMultiLevelRoute<K extends CustomFirstLevelRouteNotSingleKey = CustomFirstLevelRouteNotSingleKey> =
    K extends string
      ? ElegantConstRoute & {
          name: K;
          path: RouteMap[K];
          component: `layout.${RouteLayout}`;
          children: (CustomCenterLevelRoute<GetChildRouteKey<K>> | CustomLastLevelRoute<GetChildRouteKey<K>>)[];
        }
      : never;

  /**
   * the custom route
   */
  type CustomRoute = CustomSingleLevelRoute | CustomMultiLevelRoute;

  /**
   * the generated route
   */
  type GeneratedRoute = SingleLevelRoute | MultiLevelRoute;

  /**
   * the elegant route
   */
  type ElegantRoute = GeneratedRoute | CustomRoute;
}
