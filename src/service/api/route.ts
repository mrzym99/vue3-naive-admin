import { request } from '../request';

/** get user routes */
export function fetchGetUserRoutes() {
  return request<Api.Route.MenuRoute[]>({ url: '/auth/account/menus' });
}

/**
 * whether the route is exist
 *
 * @param routeName route name
 */
export function fetchIsRouteExist(routeName: string) {
  return request<boolean>({ url: '/route/isRouteExist', params: { routeName } });
}
