import type { AxiosResponse } from 'axios';
import { createFlatRequest } from '@sa/axios';
import { $t } from '@/locales';
import { getServiceBaseURL } from '@/utils/service';
import { useSSEStore } from '@/store/modules/sse';
import { addTimestamp, getAuthorization, handleExpiredRequest, showErrorMsg, useLogout } from './shared';
import type { RequestInstanceState } from './type';

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

export const request = createFlatRequest<App.Service.Response, RequestInstanceState>(
  {
    baseURL
    // headers: {
    //   apifoxToken: 'XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2'
    // }
  },
  {
    async onRequest(config) {
      const Authorization = getAuthorization();
      Object.assign(config.headers, { Authorization });
      // get get请求增加 时间戳 防止 304
      addTimestamp(config);
      return config;
    },
    isBackendSuccess(response) {
      const sseStore = useSSEStore();
      sseStore.setServerConnectStatus(true);
      // when the backend response code is "0000"(default), it means the request is success
      // to change this logic by yourself, you can modify the `VITE_SERVICE_SUCCESS_CODE` in `.env` file
      return String(response.data.code) === import.meta.env.VITE_SERVICE_SUCCESS_CODE;
    },
    // 这里会对后台定义的 成功 code 进行一次判断，并且对错误的 code 进行处理 数据层我们只需判断 error 即可
    async onBackendFail(response, instance) {
      const responseCode = String(response.data.code);

      const { VITE_SERVICE_EXPIRED_TOKEN_CODES } = import.meta.env;
      const expiredTokenCodes = VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
      if (expiredTokenCodes.includes(responseCode)) {
        const success = await handleExpiredRequest(request.state);
        if (success) {
          const Authorization = getAuthorization();
          if (response) {
            Object.assign(response.config.headers, { Authorization });
            return instance.request(response.config) as Promise<AxiosResponse>;
          }
        }
      }

      return null;
    },
    transformBackendResponse(response) {
      return response.data.data;
    },
    // 这里也是使用在了 intercepter 里， 用于错误code处理
    async onError(error) {
      const { handleLogout, logoutAndCleanup } = useLogout();
      // when the request is fail, you can show error message

      const { VITE_SERVICE_LOGOUT_CODES, VITE_SERVICE_MODAL_LOGOUT_CODES } = import.meta.env;
      // get backend error message and code
      const message = error.response?.data?.message || error.message || '';
      const backendErrorCode = String(error.response?.data?.code || '');

      // when the token is expired, refresh token and retry request, so no need to show error message

      // when the backend response code is in `logoutCodes`, it means the user will be logged out and redirected to login page
      const logoutCodes = VITE_SERVICE_LOGOUT_CODES?.split(',') || [];
      if (logoutCodes.includes(backendErrorCode)) {
        handleLogout();
        showErrorMsg(request.state, message);
        return;
      }

      const modalLogoutCodes = VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
      if (modalLogoutCodes.includes(backendErrorCode)) {
        request.state.errMsgStack = [...(request.state.errMsgStack || []), message];
        modelLogOut(message, handleLogout, logoutAndCleanup);
        return;
      }
      showErrorMsg(request.state, message);
    }
  }
);

function modelLogOut(message: string, handleLogout: () => void, logoutAndCleanup: () => void) {
  window.addEventListener('beforeunload', handleLogout);
  window.$dialog?.error({
    title: $t('common.error'),
    content: message,
    positiveText: $t('common.confirm'),
    maskClosable: false,
    closeOnEsc: false,
    onPositiveClick() {
      logoutAndCleanup();
    },
    onClose() {
      handleLogout();
    }
  });
}
