
ARG PROJECT_DIR=/vue3-naive-admin

FROM node:21.7.3 as builder
ARG PROJECT_DIR
WORKDIR $PROJECT_DIR

# 安装pnpm
RUN npm install -g pnpm

COPY . ./

# 安装依赖
# 若网络不通，可以使用淘宝源
# RUN pnpm config set registry https://registry.npmmirror.com
RUN rm -rf node_modules
RUN pnpm install

# 构建项目
ENV VITE_BASE_URL=/
RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm build


FROM nginx:alpine as production
ARG PROJECT_DIR

COPY --from=builder $PROJECT_DIR/dist/ /usr/share/nginx/html
COPY --from=builder $PROJECT_DIR/nginx.conf /etc/nginx/nginx.conf

EXPOSE 3333

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]