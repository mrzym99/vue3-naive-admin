import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { useIdle } from '@vueuse/core';
import mitt from 'mitt';
import { uniqueSlash } from '@/utils/urlUtils';
import { useAuthStore } from '../auth';
import { useRouteStore } from '../route';
import { getToken } from '../auth/shared';

export type MessageEvent = {
  data?: any;
  type?: 'ping' | 'close' | 'logout' | 'updatePermsAndMenus' | 'updateOnlineUsers';
};

type Events = {
  onlineUser: number;
};

export const useSSEStore = defineStore('sse', () => {
  const emitter = mitt<Events>();
  const authStore = useAuthStore();
  const routeStore = useRouteStore();
  const { idle } = useIdle(5 * 60 * 1000); // 5 min
  let eventSource: EventSource | null = null;
  const serverConnected = ref(true);
  const onlineUserCount = ref(0);

  watch(serverConnected, val => {
    if (val && getToken()) {
      initServerMsgListener();
    } else {
      closeEventSource();
    }
  });

  watch(idle, idleValue => {
    if (idleValue) {
      closeEventSource();
    } else if (getToken()) {
      setServerConnectStatus(true);
    }
  });

  function closeEventSource() {
    serverConnected.value = false;
    eventSource?.close();
    eventSource = null;
  }

  /** 监听来自服务端推送的消息 */
  async function initServerMsgListener() {
    if (eventSource) {
      eventSource.close();
    }
    const uid = authStore.userInfo.id;
    if (!uid) return;
    const sseUrl = uniqueSlash(`${import.meta.env.VITE_SERVICE_BASE_URL}/sse/${uid}?token=${getToken()}`);

    eventSource = new EventSource(sseUrl);

    // 处理 SSE 传递的数据
    eventSource.onmessage = event => {
      const { type } = JSON.parse(event.data) as MessageEvent;
      console.log(type);

      // 服务器关闭 SSE 连接
      if (type === 'close') {
        closeEventSource();
      } else if (type === 'logout') {
        authStore.resetStore();
        closeEventSource();
        window.$dialog?.error({
          title: '提示',
          content: '您已被强制下线！',
          positiveText: '确定'
        });
      }
      // 当用户的权限及菜单有变更时，重新获取权限及菜单
      else if (type === 'updatePermsAndMenus') {
        routeStore.initAuthRoute();
      }
      // 在线用户数量变更时
      else if (type === 'updateOnlineUsers') {
        emitter.emit('onlineUser', onlineUserCount.value);
      }

      // console.log('eventSource', event.data);
    };

    eventSource.onerror = err => {
      console.log('eventSource err', err);
      closeEventSource();
    };
  }

  function setServerConnectStatus(isConnect: boolean) {
    serverConnected.value = isConnect;
  }

  return {
    emitter,
    onlineUserCount,
    closeEventSource,
    initServerMsgListener,
    setServerConnectStatus
  };
});
