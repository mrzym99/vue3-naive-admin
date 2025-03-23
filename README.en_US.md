# Vue3NaiveAdmin

<div align="center">
  <img src="./public/favicon.svg" width="100" />
  <h1>Vue3NaiveAdmin</h1>
  <span>中文 | <a href="./README.en_US.md">English</a></span>
</div>

---

[![license](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![gitee stars](https://gitee.com/mrzym/vue3-naive-admin/badge/star.svg)](https://github.com/mrzym99/vue3-naive-admin)
[![github stars](https://img.shields.io/github/stars/mrzym99/vue3-naive-admin)](https://github.com/mrzym99/vue3-naive-admin)
[![github forks](https://img.shields.io/github/forks/mrzym99/vue3-naive-admin)](https://github.com/mrzym99/vue3-naive-admin)

> [Gitee address](https://gitee.com/mrzym/vue3-naive-admin): https://gitee.com/mrzym/vue3-naive-admin

> [Github address](https://github.com/mrzym99/vue3-naive-admin): https://github.com/mrzym99/vue3-naive-admin

> [Experience vue3-naive-admin](https://nest.mrzym.top)


> [Vue3NaiveAdmin](https://github.com/mrzym99/vue3-naive-admin) is developed based on [SoybeanAdmin](https://docs.soybeanjs.cn/zh/). If you find `SoybeanAdmin` or `Vue3NaiveAdmin` useful, please give us a ⭐️ on GitHub/Gitee. Your support encourages us to keep improving and adding features! Thank you!

> Special thanks to the [SoybeanJS](https://github.com/soybeanjs) team for their contributions. Let's work together to create more high-quality open-source projects for the community.


## Introduction

[SoybeanAdmin](https://docs.soybeanjs.cn/zh/) is a clean, elegant, and feature-rich admin template based on the latest front-end tech stack, including Vue3, Vite5, TypeScript, Pinia, and UnoCSS. It offers built-in themes, strict code standards, and an automated file routing system. `SoybeanAdmin` provides an all-in-one solution for admin management, requiring no extra setup. It's also a great way to learn modern front-end technologies.

[Vue3NaiveAdmin](https://github.com/mrzym99/vue3-naive-admin) follows the [SoybeanAdmin development standards](https://docs.soybeanjs.cn/zh/standard/), retaining all its features while adding advanced components (details in component READMEs). The framework's built-in functionality can be explored in the [SoybeanAdmin official documentation](https://docs.soybeanjs.cn/zh/guide/intro.html), with backend support from [Nest-Admin](https://github.com/mrzym99/nest-admin).

## Features

- **Modern Tech Stack**: Utilizes Vue3, Vite5, TypeScript, Pinia, and UnoCSS.
- **Clear Architecture**: Uses pnpm monorepo for a well-structured and elegant project.
- **Strict Code Standards**: Follows [SoybeanJS standards](https://docs.soybeanjs.cn/zh/standard), with eslint, prettier, and simple-git-hooks for code quality.
- **TypeScript Support**: Ensures strict type checking for better maintainability.
- **Rich Theme Configurations**: Offers diverse themes integrated with UnoCSS.
- **Built-in Internationalization**: Simplifies multi-language support.
- **Automated File Routing**: Generates route imports, declarations, and types automatically. See [Elegant Router](https://github.com/soybeanjs/elegant-router) for details.
- **Flexible Route Permissions**: Supports both front-end static and back-end dynamic routes.
- **Abundant Page Components**: Includes components for 403, 404, 500 pages, layout, tags, theme settings, etc.
- **Command-line Tools**: Built-in efficient tools for git commits, file deletion, publishing, etc.
- **Mobile Adaptation**: Fully supports mobile devices with responsive layouts.
- **Advanced Components**: Built-in tables, forms, details components for rapid page development.


## Documentation

- [SoybeanAdmin Documentation](https://docs.soybeanjs.cn)
- [Vue3NaiveAdmin Documentation (coming soon)]()


## Cooperation

### Contact

For cooperation or project inquiries, reach out through:

- **Email**: [2715158815@qq.com](2715158815@qq.com)
- **Business Cooperation WeChat**: M2715158815

Looking forward to collaborating to advance Vue3NaiveAdmin and its applications!

## Example Images

![](https://nest-image.mrzym.top/login.png)
![](https://nest-image.mrzym.top/register.png)
![](https://nest-image.mrzym.top/home.png)
![](https://nest-image.mrzym.top/dark-home.png)
![](https://nest-image.mrzym.top/config.png)
![](https://nest-image.mrzym.top/user.png)
![](https://nest-image.mrzym.top/menu.png)
![](https://nest-image.mrzym.top/task.png)
![](https://nest-image.mrzym.top/log.png)
![](https://nest-image.mrzym.top/service.png)

Mobile Adaptation

![](https://nest-image.mrzym.top/home-mobile.png)
![](https://nest-image.mrzym.top/menu-mobile.png)


## Usage

**Environment Preparation**

Ensure your environment meets these requirements:

- **git**: For cloning and managing project versions.
- **NodeJS**: >=18.12.0, recommend 18.19.0 or higher.
- **pnpm**: >= 8.7.0, recommend 8.14.0 or higher.

**Clone Project**

```bash
git clone https://github.com/mrzym99/vue3-naive-admin
```

**Install Dependencies**

```bash
pnpm i
```
> This project uses pnpm monorepo management. Do not use npm or yarn to install dependencies.

**Start Project**

```bash
pnpm dev
```

**Build Project**

```bash
pnpm build
```

**Code Synchronization**

1. Add Vue3NaiveAdmin's git address to your repository
```
git remote add otherOrigin https://github.com/mrzym99/vue3-naive-admin.git
```
2. Fetch the code
```
git fetch otherOrigin
```

3. Use `cherry-pick` to select the git commits you need to update
```
git cherry-pick [commit id]
```
4. Resolve conflicts if any, then continue with:
```
git cherry-pick --continue
```

## Docker Build

This project uses Docker for building and running. Follow these steps:

**Environment Requirements** 

Your environment must have:
- Stable Docker and Docker Compose.

**Notes**

- docker-compose.yml is for development (dev).
- docker-compose.prod.yml is for production (prod).

1. Build the project
```
docker-compose build
```

2. Run the project
```
docker-compose up -d // (-f [filename] to specify a different compose file. -d runs in background, suitable for servers. Exiting terminal won't stop containers.)
```

3. Stop and remove
```
docker-compose down (use -v to delete container data).
```
[Docker Compose Commands](https://www.cnblogs.com/xyh9039/p/18540766)

If build fails, check your Docker environment. Consider using [Alibaba Cloud Mirror Acceleration](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors).

## How to Contribute
All forms of contributions are welcome. Share your ideas or suggestions via [pull requests](https://github.com/mrzym99/vue3-naive-admin/pulls) or create a GitEE [issue](https://github.com/mrzym99/vue3-naive-admin/issues/new).

## Git Commit Specifications

This project has built-in `commit` commands. Generate commit messages compliant with [Conventional Commits](https://www.conventionalcommits.org/) by running `pnpm commit`. Ensure you use this command when submitting PRs for message compliance.

## Browser Support

For the best development experience, use the latest Chrome.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png" alt="IE" width="24px" height="24px"  />](http://godban.github.io/browsers-support-badges/ ) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/ ) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/ ) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/ ) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/ ) |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| not support                                                                                                                                                                                                                              | last 2 versions                                                                                                                                                                                | last 2 versions                                                                                                                                                                                        | last 2 versions                                                                                                                                                                                     | last 2 versions                                                                                                                                                                                     |


## Contributors

Thank you to the contributors. To contribute, see [How to Contribute](#how-to-contribute).

<a href="https://github.com/Peerless-man/vue3-blog/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Peerless-man/vue3-blog" />
</a>

## Communication

`Vue3NaiveAdmin` is open-source and free, aiding developers in building management systems. Join our WeChat and QQ groups for discussions and feel free to ask questions.

  <div>
    <p>QQ Group</p>
    <img src="https://nest-image.mrzym.top/qrcode.jpg"  height="300" width="200" />
  </div>

## Open Source License

This project is licensed under [MIT © 2025 Xiao Zhang](./LICENSE). It's for learning and reference. For commercial use, retain the author's copyright. The author isn't liable for software risks.