# 杨帆个人作品集网站

视觉设计师 / AI 设计师 / 品牌设计师个人作品集，使用 React + Vite 搭建。

## 一键启动

双击项目根目录下的 `start-site.cmd`，然后打开：

```text
http://localhost:5173/
```

这个脚本直接托管 `dist/`，不依赖 Node.js 启动，所以日常打开最稳。

## 常用命令

如果你改了源码，再运行：

```bash
pnpm install --frozen-lockfile
pnpm build
```

## 主要文件

- `src/main.jsx`：React 页面结构、个人信息、项目数据和能力卡片配置。
- `src/styles.css`：视觉样式、响应式布局、卡片和各作品模块样式。
- `vite.config.js`：Vite 配置。
- `dist/`：构建后的静态网站文件。
