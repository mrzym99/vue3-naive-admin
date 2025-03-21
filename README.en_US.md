以下是翻译后的内容：

---

<div align="center">
  <img src="./public/favicon.svg" width="100" />
  <h1>Vue3NaiveAdmin</h1>
  <span>Chinese | <a href="./README.en_US.md">English</a></span>
</div>

---

[![license](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![gitee stars](https://gitee.com/mrzym/vue3-naive-admin/badge/star.svg)](https://gitee.com/mrzym/vue3-naive-admin)


> [Vue3NaiveAdmin](https://gitee.com/mrzym/vue3-naive-admin) is a secondary development based on [SoybeanAdmin](https://docs.soybeanjs.cn/zh/). If you find `SoybeanAdmin` or `Vue3NaiveAdmin` helpful, or you like our projects, please give us a ⭐️ on GitHub/Gitee. Your support is the driving force for our continuous improvement and addition of new features! Thank you for your support!

> Special thanks to the [SoybeanJS](https://github.com/soybeanjs) team for their contributions! Let's work together to contribute more high-quality open-source projects to the community.

## Introduction

[SoybeanAdmin](https://docs.soybeanjs.cn/zh/) is a clean, elegant, beautiful, and powerful backend management template based on the latest frontend technology stack, including Vue3, Vite5, TypeScript, Pinia, and UnoCSS. It comes with a rich set of theme configurations and components, follows strict coding standards, and implements an automated file routing system. `SoybeanAdmin` provides a one-stop solution for backend management, ready to use out of the box. It is also an excellent practice for quickly learning cutting-edge technologies.

[Vue3NaiveAdmin](https://gitee.com/mrzym/vue3-naive-admin) adheres to the [SoybeanAdmin development standards](https://docs.soybeanjs.cn/zh/standard/), retaining all the features of [SoybeanAdmin](https://docs.soybeanjs.cn/zh/). It adds some advanced components (please refer to the README within the components for usage). The built-in features of the framework can be found in the [SoybeanAdmin official documentation](https://docs.soybeanjs.cn/zh/guide/intro.html). The backend is supported by [Nest-Admin](https://gitee.com/mrzym/Nest-Admin).

## Features

- **Cutting-edge technology stack**: Utilizes the latest popular technologies such as Vue3, Vite5, TypeScript, Pinia, and UnoCSS.
- **Clear project architecture**: Uses a pnpm monorepo structure, which is clear, elegant, and easy to understand.
- **Strict coding standards**: Follows the [SoybeanJS standards](https://docs.soybeanjs.cn/zh/standard), integrating eslint, prettier, and simple-git-hooks to ensure code quality.
- **TypeScript support**: Provides strict type checking to enhance code maintainability.
- **Rich theme configurations**: Offers a variety of themes perfectly integrated with UnoCSS.
- **Built-in internationalization**: Easily supports multiple languages.
- **Automated file routing system**: Automatically generates route imports, declarations, and types. For more details, see [Elegant Router](https://github.com/soybeanjs/elegant-router).
- **Flexible permission routing**: Supports both frontend static routes and backend dynamic routes.
- **Rich page components**: Includes a variety of pages and components, such as 403, 404, 500 error pages, layout components, tab components, theme configuration components, etc.
- **Command-line tools**: Built-in efficient command-line tools for git commits, file deletion, and publishing.
- **Mobile adaptation**: Perfectly supports mobile devices with responsive layout.
- **Advanced components**: Built-in advanced components for tables, forms, and details to speed up your page development (written by Xiao Zhang, inexperienced, please be gentle).

## Documentation

- [SoybeanAdmin Documentation](https://docs.soybeanjs.cn)
- [Vue3NaiveAdmin Documentation (coming soon)]()

## Collaboration

### Contact Information

If you are interested in collaboration or have project inquiries, please contact me through the following methods:

- **Email**: [2715158815@qq.com](mailto:2715158815@qq.com)
<!-- - **GitHub Issues**: Feel free to contact me through [GitEE Issues](https://gitee.com/mrzym/vue3-naive-admin/issues/new) for preliminary discussions. -->
- **Business WeChat**: M2715158815

We look forward to working with you to promote the successful application of Vue3NaiveAdmin in more fields!

## Example Images

![](http://mrzym.top/nest-admin/login.png)
![](http://mrzym.top/nest-admin/register.png)
![](http://mrzym.top/nest-admin/home.png)
![](http://mrzym.top/nest-admin/dark-home.png)
![](http://mrzym.top/nest-admin/config.png)
![](http://mrzym.top/nest-admin/user.png)
![](http://mrzym.top/nest-admin/menu.png)
![](http://mrzym.top/nest-admin/task.png)
![](http://mrzym.top/nest-admin/log.png)
![](http://mrzym.top/nest-admin/service.png)

mobile

![](http://mrzym.top/nest-admin/home-mobile.png)
![](http://mrzym.top/nest-admin/menu-mobile.png)


## Usage

**Environment Preparation**

Ensure your environment meets the following requirements:

- **git**: Required for cloning and managing project versions.
- **NodeJS**: >=18.12.0, recommended version 18.19.0 or higher.
- **pnpm**: >=8.7.0, recommended version 8.14.0 or higher.

**Clone the Project**

```bash
git clone https://gitee.com/mrzym/vue3-naive-admin
```

**Install Dependencies**

```bash
pnpm i
```
> Since this project uses a pnpm monorepo management approach, please do not use npm or yarn to install dependencies.

**Start the Project**

```bash
pnpm dev
```

**Build the Project**

```bash
pnpm build
```

**Code Synchronization**

1. Add the Vue3NaiveAdmin git address to your repository:
```bash
git remote add otherOrigin https://gitee.com/mrzym/vue3-naive-admin.git
```
2. Fetch the code:
```bash
git fetch otherOrigin
```
3. Use `cherry-pick` to select the git commits you need to update:
```bash
git cherry-pick [commit id]
```
4. If there are conflicts, resolve them first, then run the following command and save with vim:
```bash
git cherry-pick --continue
```

## Docker Build

This project uses Docker to build and run the application. You can follow the steps below to build and run the project:

### Environment Requirements

Your environment must meet the following requirements:

- Stable versions of Docker and Docker Compose are required.

### Notes

- `docker-compose.yml` corresponds to the development environment (`dev`), while `docker-compose.prod.yml` corresponds to the production environment (`prod`).

1. Build the project:

```bash
docker-compose build
```

2. Run the project:

```bash
docker-compose up -d // (-f [filename] can specify a different compose file; `-d` runs in the background, suitable for running on a server. Exiting the terminal will not stop the containers)
```

3. Stop and remove:

```bash
docker-compose down // (use `-v` to delete container data)
```

For a comprehensive list of Docker Compose commands, refer to [Docker Compose Command List](https://www.cnblogs.com/xyh9039/p/18540766).

If you encounter build failures, it may be due to issues with your Docker environment. You can switch to a different Docker source. Here, we recommend [Alibaba Cloud Mirror Acceleration](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors).

## Contributing

We warmly welcome and appreciate all forms of contributions. If you have any ideas or suggestions, feel free to submit [pull requests](https://gitee.com/mrzym/vue3-naive-admin/pulls) or create a GitEE [issue](https://gitee.com/mrzym/vue3-naive-admin/issues/new).

## Git Commit Standards

This project has a built-in `commit` command. You can run `pnpm commit` to generate commit messages that comply with the [Conventional Commits](https://www.conventionalcommits.org/) standards. When submitting a PR, please use the `commit` command to ensure the message is standardized.

## Browser Support

We recommend using the latest version of Chrome for development to ensure the best experience.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png" alt="IE" width="24px" height="24px"  />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/) |
| --- | --- | --- | --- | --- |
| not supported | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## Contributors

Thank you to all the contributors. If you would like to contribute to this project, please refer to [How to Contribute](#how-to-contribute).

<a href="https://github.com/Peerless-man/vue3-blog/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Peerless-man/vue3-blog" />
</a>

## Communication

`Vue3NaiveAdmin` is a completely open-source and free project aimed at helping developers more easily build medium and large management systems. We also provide WeChat and QQ groups for communication. Feel free to ask questions in the groups.

<div>
  <p>QQ Group</p>
  <img src="http://mrzym.top/nest-admin/qrcode.png" height="300" width="200" />
</div>

## Open Source License

This project is licensed under the [MIT © 2025 Xiao Zhang](./LICENSE) license. It is intended for learning and reference only. For commercial use, please retain the author's copyright information. The author does not guarantee nor assume any liability for the use of this software.