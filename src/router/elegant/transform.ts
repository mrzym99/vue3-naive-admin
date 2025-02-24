/* eslint-disable */
/* prettier-ignore */
// Generated by elegant-router
// Read more: https://github.com/soybeanjs/elegant-router

import type { RouteRecordRaw, RouteComponent } from 'vue-router';
import type { ElegantConstRoute } from '@elegant-router/vue';
import type { RouteMap, RouteKey, RoutePath } from '@elegant-router/types';

/**
 * transform elegant const routes to vue routes
 * @param routes elegant const routes
 * @param layouts layout components
 * @param views view components
 */
export function transformElegantRoutesToVueRoutes(
  routes: ElegantConstRoute[],
  layouts: Record<string, RouteComponent | (() => Promise<RouteComponent>)>,
  views: Record<string, RouteComponent | (() => Promise<RouteComponent>)>
) {
  return routes.flatMap(route => transformElegantRouteToVueRoute(route, layouts, views));
}

/**
 * transform elegant route to vue route
 * @param route elegant const route
 * @param layouts layout components
 * @param views view components
 */
function transformElegantRouteToVueRoute(
  route: ElegantConstRoute,
  layouts: Record<string, RouteComponent | (() => Promise<RouteComponent>)>,
  views: Record<string, RouteComponent | (() => Promise<RouteComponent>)>
) {
  const LAYOUT_PREFIX = 'layout.';
  const VIEW_PREFIX = 'view.';
  const ROUTE_DEGREE_SPLITTER = '_';
  const FIRST_LEVEL_ROUTE_COMPONENT_SPLIT = '$';

  function isLayout(component: string) {
    return component.startsWith(LAYOUT_PREFIX);
  }

  function getLayoutName(component: string) {
    const layout = component.replace(LAYOUT_PREFIX, '');

    if(!layouts[layout]) {
      throw new Error(`Layout component "${layout}" not found`);
    }

    return layout;
  }

  function isView(component: string) {
    return component.startsWith(VIEW_PREFIX);
  }

  function getViewName(component: string) {
    const view = component.replace(VIEW_PREFIX, '');

    if(!views[view]) {
      throw new Error(`View component "${view}" not found`);
    }

    return view;
  }

  function isFirstLevelRoute(item: ElegantConstRoute) {
    return !item.name.includes(ROUTE_DEGREE_SPLITTER);
  }

  function isSingleLevelRoute(item: ElegantConstRoute) {
    return isFirstLevelRoute(item) && !item.children?.length;
  }

  function getSingleLevelRouteComponent(component: string) {
    const [layout, view] = component.split(FIRST_LEVEL_ROUTE_COMPONENT_SPLIT);

    return {
      layout: getLayoutName(layout),
      view: getViewName(view)
    };
  }

  const vueRoutes: RouteRecordRaw[] = [];

  // add props: true to route
  if (route.path.includes(':') && !route.props) {
    route.props = true;
  }

  const { name, path, component, children, ...rest } = route;

  const vueRoute = { name, path, ...rest } as RouteRecordRaw;

  try {
    if (component) {
      if (isSingleLevelRoute(route)) {
        const { layout, view } = getSingleLevelRouteComponent(component);

        const singleLevelRoute: RouteRecordRaw = {
          path,
          component: layouts[layout],
          meta: {
            title: route.meta?.title || ''
          },
          children: [
            {
              name,
              path: '',
              component: views[view],
              ...rest
            } as RouteRecordRaw
          ]
        };

        return [singleLevelRoute];
      }

      if (isLayout(component)) {
        const layoutName = getLayoutName(component);

        vueRoute.component = layouts[layoutName];
      }

      if (isView(component)) {
        const viewName = getViewName(component);

        vueRoute.component = views[viewName];
      }

    }
  } catch (error: any) {
    console.error(`Error transforming route "${route.name}": ${error.toString()}`);
    return [];
  }

  // add redirect to child
  if (children?.length && !vueRoute.redirect) {
    vueRoute.redirect = {
      name: children[0].name
    };
  }

  if (children?.length) {
    const childRoutes = children.flatMap(child => transformElegantRouteToVueRoute(child, layouts, views));

    if(isFirstLevelRoute(route)) {
      vueRoute.children = childRoutes;
    } else {
      vueRoutes.push(...childRoutes);
    }
  }

  vueRoutes.unshift(vueRoute);

  return vueRoutes;
}

/**
 * map of route name and route path
 */
const routeMap: RouteMap = {
  "root": "/",
  "not-found": "/:pathMatch(.*)*",
  "exception": "/exception",
  "exception_403": "/exception/403",
  "exception_404": "/exception/404",
  "exception_500": "/exception/500",
  "document": "/document",
  "document_project": "/document/project",
  "document_project-link": "/document/project-link",
  "document_vue": "/document/vue",
  "document_vite": "/document/vite",
  "document_unocss": "/document/unocss",
  "document_naive": "/document/naive",
  "document_antd": "/document/antd",
  "document_alova": "/document/alova",
  "403": "/403",
  "404": "/404",
  "500": "/500",
  "about": "/about",
  "function": "/function",
  "function_hide-child": "/function/hide-child",
  "function_hide-child_one": "/function/hide-child/one",
  "function_hide-child_three": "/function/hide-child/three",
  "function_hide-child_two": "/function/hide-child/two",
  "function_multi-tab": "/function/multi-tab",
  "function_request": "/function/request",
  "function_super-page": "/function/super-page",
  "function_tab": "/function/tab",
  "function_toggle-auth": "/function/toggle-auth",
  "home": "/home",
  "iframe-page": "/iframe-page/:url",
  "login": "/login/:module(pwd-login|code-login|register|reset-pwd|bind-wechat)?",
  "multi-menu": "/multi-menu",
  "multi-menu_first": "/multi-menu/first",
  "multi-menu_first_child": "/multi-menu/first/child",
  "multi-menu_second": "/multi-menu/second",
  "multi-menu_second_child": "/multi-menu/second/child",
  "multi-menu_second_child_home": "/multi-menu/second/child/home",
  "plugin": "/plugin",
  "plugin_barcode": "/plugin/barcode",
  "plugin_charts": "/plugin/charts",
  "plugin_charts_antv": "/plugin/charts/antv",
  "plugin_charts_echarts": "/plugin/charts/echarts",
  "plugin_charts_vchart": "/plugin/charts/vchart",
  "plugin_copy": "/plugin/copy",
  "plugin_editor": "/plugin/editor",
  "plugin_editor_markdown": "/plugin/editor/markdown",
  "plugin_editor_quill": "/plugin/editor/quill",
  "plugin_excel": "/plugin/excel",
  "plugin_gantt": "/plugin/gantt",
  "plugin_gantt_dhtmlx": "/plugin/gantt/dhtmlx",
  "plugin_gantt_vtable": "/plugin/gantt/vtable",
  "plugin_icon": "/plugin/icon",
  "plugin_map": "/plugin/map",
  "plugin_pdf": "/plugin/pdf",
  "plugin_pinyin": "/plugin/pinyin",
  "plugin_print": "/plugin/print",
  "plugin_swiper": "/plugin/swiper",
  "plugin_tables": "/plugin/tables",
  "plugin_tables_vtable": "/plugin/tables/vtable",
  "plugin_typeit": "/plugin/typeit",
  "plugin_video": "/plugin/video",
  "system": "/system",
  "system_dept": "/system/dept",
  "system_menu": "/system/menu",
  "system_role": "/system/role",
  "system_user": "/system/user",
  "user-center": "/user-center"
};

/**
 * get route path by route name
 * @param name route name
 */
export function getRoutePath<T extends RouteKey>(name: T) {
  return routeMap[name];
}

/**
 * get route name by route path
 * @param path route path
 */
export function getRouteName(path: RoutePath) {
  const routeEntries = Object.entries(routeMap) as [RouteKey, RoutePath][];

  const routeName: RouteKey | null = routeEntries.find(([, routePath]) => routePath === path)?.[0] || null;

  return routeName;
}
