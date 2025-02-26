/* eslint-disable */
/* prettier-ignore */
// Generated by elegant-router
// Read more: https://github.com/soybeanjs/elegant-router

import type { RouteComponent } from "vue-router";
import type { LastLevelRouteKey, RouteLayout } from "@elegant-router/types";

import BaseLayout from "@/layouts/base-layout/index.vue";
import BlankLayout from "@/layouts/blank-layout/index.vue";

export const layouts: Record<RouteLayout, RouteComponent | (() => Promise<RouteComponent>)> = {
  base: BaseLayout,
  blank: BlankLayout,
};

export const views: Record<LastLevelRouteKey, RouteComponent | (() => Promise<RouteComponent>)> = {
  403: () => import("@/views/_builtin/403/index.vue"),
  404: () => import("@/views/_builtin/404/index.vue"),
  500: () => import("@/views/_builtin/500/index.vue"),
  "iframe-page": () => import("@/views/_builtin/iframe-page/[url].vue"),
  login: () => import("@/views/_builtin/login/index.vue"),
  about: () => import("@/views/about/index.vue"),
  "function_hide-child_one": () => import("@/views/function/hide-child/one/index.vue"),
  "function_hide-child_three": () => import("@/views/function/hide-child/three/index.vue"),
  "function_hide-child_two": () => import("@/views/function/hide-child/two/index.vue"),
  "function_multi-tab": () => import("@/views/function/multi-tab/index.vue"),
  function_request: () => import("@/views/function/request/index.vue"),
  "function_super-page": () => import("@/views/function/super-page/index.vue"),
  function_tab: () => import("@/views/function/tab/index.vue"),
  "function_toggle-auth": () => import("@/views/function/toggle-auth/index.vue"),
  home: () => import("@/views/home/index.vue"),
  "multi-menu_first_child": () => import("@/views/multi-menu/first_child/index.vue"),
  "multi-menu_second_child_home": () => import("@/views/multi-menu/second_child_home/index.vue"),
  plugin_barcode: () => import("@/views/plugin/barcode/index.vue"),
  plugin_charts_antv: () => import("@/views/plugin/charts/antv/index.vue"),
  plugin_charts_echarts: () => import("@/views/plugin/charts/echarts/index.vue"),
  plugin_charts_vchart: () => import("@/views/plugin/charts/vchart/index.vue"),
  plugin_copy: () => import("@/views/plugin/copy/index.vue"),
  plugin_editor_markdown: () => import("@/views/plugin/editor/markdown/index.vue"),
  plugin_editor_quill: () => import("@/views/plugin/editor/quill/index.vue"),
  plugin_excel: () => import("@/views/plugin/excel/index.vue"),
  plugin_gantt_dhtmlx: () => import("@/views/plugin/gantt/dhtmlx/index.vue"),
  plugin_gantt_vtable: () => import("@/views/plugin/gantt/vtable/index.vue"),
  plugin_icon: () => import("@/views/plugin/icon/index.vue"),
  plugin_map: () => import("@/views/plugin/map/index.vue"),
  plugin_pdf: () => import("@/views/plugin/pdf/index.vue"),
  plugin_pinyin: () => import("@/views/plugin/pinyin/index.vue"),
  plugin_print: () => import("@/views/plugin/print/index.vue"),
  plugin_swiper: () => import("@/views/plugin/swiper/index.vue"),
  plugin_tables_vtable: () => import("@/views/plugin/tables/vtable/index.vue"),
  plugin_typeit: () => import("@/views/plugin/typeit/index.vue"),
  plugin_video: () => import("@/views/plugin/video/index.vue"),
  system_dept: () => import("@/views/system/dept/index.vue"),
  system_menu: () => import("@/views/system/menu/index.vue"),
  "system_monitor_login-log": () => import("@/views/system/monitor/login-log/index.vue"),
  system_monitor_online: () => import("@/views/system/monitor/online/index.vue"),
  system_monitor_serve: () => import("@/views/system/monitor/serve/index.vue"),
  system_parameter: () => import("@/views/system/parameter/index.vue"),
  system_role: () => import("@/views/system/role/index.vue"),
  system_user: () => import("@/views/system/user/index.vue"),
  tools_storage_local: () => import("@/views/tools/storage/local/index.vue"),
  tools_storage_oss: () => import("@/views/tools/storage/oss/index.vue"),
  "user-center": () => import("@/views/user-center/index.vue"),
};
