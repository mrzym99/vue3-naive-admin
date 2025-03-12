import type { GeneratedRoute } from '@elegant-router/types';
import { generatedRoutes } from './routes';

type Route = {
  name: string;
  path: string;
  component?: string;
  meta?: {
    title?: string;
    i18nKey?: App.I18n.I18nKey | null | undefined;
  };
};

const routeList: Route[] = routesToComponentList(generatedRoutes as ExtendedRoute[]);

type ExtendedRoute = GeneratedRoute & {
  children?: ExtendedRoute[];
};

function routesToComponentList(routes: ExtendedRoute[]): Route[] {
  return routes.flatMap(route => [
    ...(route.component ? [createRoute(route)] : []),
    ...(Object.keys(route).includes('children') && Array.isArray(route?.children)
      ? routesToComponentList(route?.children)
      : [])
  ]);
}

function createRoute(gRoute: GeneratedRoute): Route {
  return {
    name: gRoute.name,
    path: gRoute.path,
    component: gRoute.component,
    meta: {
      title: gRoute.meta?.title,
      i18nKey: gRoute.meta?.i18nKey
    }
  };
}

export default routeList;
