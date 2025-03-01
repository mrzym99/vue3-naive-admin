import type { InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/modules/auth';
import { localStg } from '@/utils/storage';
import { fetchRefreshToken } from '../api';
import type { RequestInstanceState } from './type';

export function getAuthorization() {
  const token = localStg.get('token');
  const Authorization = token ? `Bearer ${token}` : null;

  return Authorization;
}

export function addTimestamp(config: InternalAxiosRequestConfig) {
  if (config.method === 'get') {
    const timestamp = new Date().getTime();
    config.params = {
      ...config.params,
      _t: timestamp
    };
  }
}

/** refresh token */
async function handleRefreshToken() {
  const aToken = localStg.get('token') || '';
  const { error, data } = await fetchRefreshToken(aToken);

  if (!error) {
    localStg.set('token', data.access_token);
    return true;
  }
  return false;
}

export async function handleExpiredRequest(state: RequestInstanceState) {
  if (!state.refreshTokenFn) {
    state.refreshTokenFn = handleRefreshToken();
  }
  const success = await state.refreshTokenFn;

  setTimeout(() => {
    state.refreshTokenFn = null;
  }, 1000);

  return success;
}

export function showErrorMsg(state: RequestInstanceState, message: string) {
  if (!state.errMsgStack?.length) {
    state.errMsgStack = [];
  }

  const isExist = state.errMsgStack.includes(message);

  if (!isExist) {
    state.errMsgStack.push(message);

    window.$message?.error(message, {
      onLeave: () => {
        state.errMsgStack = state.errMsgStack.filter(msg => msg !== message);

        setTimeout(() => {
          state.errMsgStack = [];
        }, 5000);
      }
    });
  }
}

export function useLogout() {
  const authStore = useAuthStore();
  function handleLogout() {
    authStore.resetStore();
  }

  function logoutAndCleanup() {
    handleLogout();
    window.removeEventListener('beforeunload', handleLogout);
  }

  return {
    handleLogout,
    logoutAndCleanup
  };
}
