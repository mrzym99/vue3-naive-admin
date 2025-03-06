
# 第二阶段：运行环境
FROM nginx:alpine

# 复制构建产物
COPY  /dist /usr/share/nginx/html

# 复制自定义nginx配置（需自行创建）
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动nginx服务
CMD ["nginx", "-g", "daemon off;"]