# 使用 Alpine 版本的 Nginx 作为基础镜像
FROM nginx:alpine

# 删除默认的 Nginx 配置文件
RUN rm /etc/nginx/conf.d/default.conf

#  下载依赖
RUN pnpm install

# 构建前端应用
RUN pnpm run build

# 复制构建产物
COPY  /dist /usr/share/nginx/html

# 将自定义的 Nginx 配置文件复制到镜像中
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]