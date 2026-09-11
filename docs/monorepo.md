# Colorful workspace

采用 npm workspaces，独立发布包与官网应用共享一份 lockfile。

- `packages/icons`：`@colorful-icons/react`，包含 SVG 资产、绘制源、生成器、React CSR/SSR 组件、类型、主题和动画。图标包不依赖 Tailwind、shadcn 或官网。
- `apps/web`：`@colorful/web`，私有 Vite 应用。通过工作区依赖和图标包公开 exports 消费组件；使用 shadcn/Radix 与 Tailwind v4 构建交互界面。
- `apps/web/src/lib/icon-loaders.ts`：由公开 catalog 生成独立动态 import，每个图标只在使用时加载。
- `apps/web/public/brand`：Colorful. SVG 标志、字标与 favicon。

官网保留搜索、分类、预览、配色、六种样式、动画、镜像与导出。中英文选择保存在浏览器本地；简化文案与导航，不发布旧对照页。原官网代码归档于 `packages/icons/design/archive/site-v0.6`，仅供历史设计参考。

根目录 `npm run dev` 启动官网；`npm run build` 先构建包再构建官网；`npm run check` 分别检查两者；`npm run pack:icons` 生成可安装图标包。初次安装后先运行 `npm run build:icons` 供官网读取公开模块。
