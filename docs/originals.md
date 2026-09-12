# Colorful Originals

新增 1,000 个独立命名的原创插画图标，保留已有 1,519 个图标。这里的原创指新的造型由项目自行绘制，未从 Phosphor 或其他图标库导入路径。常见物件的概念不属于独占设计。

## 绘制规范

统一造型与验收规则见 [风格规范 1.1](originals-style.md)，并由生成流程自动执行。

- 主体由圆润的真实物件部件构成，使用 surface / back / detail 三色。
- 24×24 坐标，保留加粗与形变空间；线条仅表达结构。
- 不靠换色、镜像、编号、通用底板或状态徽章补足数量。
- 相关物件可复用轮子、把手等基础构件，主要轮廓和识别部件需要表达自己的语义。

## 源与构建

`packages/icons/design/originals/{living,nature,places}.mjs` 及其同名前缀模块保存显式绘图配方；`kit.mjs` 只提供基础几何元素。每项包含中文名称、英文关键词、分类与造型说明。

`npm run originals` 验证并写出 SVG、目录、六种粗细和 React 模块。`npm run build:icons` 构建可安装组件包。`npm run redesign` 同时重建已有系列和原创系列。

生成器先检查全部条目再写入资产：名称与数量、SVG XML、三色 token、圆角、描边边界和相同几何结构。`design/originals/review` 保存检查报告与实际尺寸联系表；几何去重不等于视觉审查，需同时核对物件识别度与同族差异。

官网使用公开的组件包目录，统一展示全部 2,519 个 Colorful 图标，按用途分类与搜索，不再区分新增批次。继续使用原有配色、六种样式、分层动效和导出功能。

`npm run pack:originals` 生成 `artifacts/colorful-originals-1000.zip`，包含六种样式共 6,000 个静态 SVG、双语目录与授权文件。导出的 SVG 使用标准十六进制颜色，方便导入设计工具。

整库构建的 Node 进程使用 8 GB 堆内存上限，ESM/CJS 与 UMD 分开执行，避免扩充后的模块与类型声明生成超过默认的 4 GB 上限。
