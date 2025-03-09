# 第一阶段：构建前端应用
# 使用 Node.js 镜像来构建应用
FROM node:21.7.3 AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm i pnpm -g

# 复制应用代码
COPY . ./

# 清理缓存并重新安装依赖
RUN rm -rf node_modules && pnpm store prune && pnpm install

# 构建应用，增加内存限制
RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm run build



# 第二阶段：运行 Nginx 服务
# 使用 Alpine 版本的 Nginx 作为基础镜像
FROM nginx:alpine

# 删除默认的 Nginx 配置文件
RUN rm /etc/nginx/conf.d/default.conf

# 将构建生成的文件复制到 Nginx 的 root 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 将自定义的 Nginx 配置文件复制到镜像中
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]