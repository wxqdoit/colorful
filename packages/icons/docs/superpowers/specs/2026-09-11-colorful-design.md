# Colorful React 图标库设计

目标：按 Phosphor React 的架构实现可独立使用的柔和色块 SVG 图标库。原始依据为 `docs/SKILL.md` 和三枚参考 SVG；不改写这些输入文件。

## 上游对齐

参考 https://github.com/phosphor-icons/react ，commit `81ac06f9bf4b4dedf9b8fead0a1ebd47c41d67ef`，package 2.1.10。

使用资产 → assemble → 每枚图标一份 regular artwork → CSR / SSR forwardRef 包装 → 公共基类在渲染时派生 weight → 分模块 ESM/CJS 与声明文件的流程。公共 API 包含 size、color、weight、mirrored、alt、SVG props、children、ref、IconContext、IconBase、SSRBase、Icon/IconProps/IconWeight。每枚导出 `NameIcon` 和 `Name`，支持根入口和深层导入。CSR 保留 use client，SSR 依赖链无 Context。

## 视觉与有意差异

- 默认 24×24 viewBox、26px、regular 1.1 细线。保留原始 3 枚 SVG 的路径与层级。
- 六种 weight 使用同一物件语义：thin/light/regular/bold 的细节线宽分别为 1.0/1.05/1.1/1.25；fill 为色块版本，省略辅助描线；duotone 用 surface 与 detail 两级颜色，保留结构线。各 weight 都保留插画色块，不冒充 Phosphor 的线性图形。
- `color` 只覆盖 detail 色，避免多层填色退化；新增 palette（六个可选语义色）和 theme（light/dark）。CSS 变量沿用 `--project-art-*`，无 CSS 导入也有浅色回退。显式 theme 在 SVG 上设置色阶，palette 可以逐项覆盖。
- 显式组件 props 优先于 Context，包括 false。style/palette 合并；SSR 使用同一渲染规则，但不读 Context。默认装饰图标隐藏于辅助技术；alt / aria-label / aria-labelledby 为图标提供名称，显式 aria-hidden 可覆盖。
- React peer >=18，构建 Node >=22。采用实际 .cjs 扩展名，SSR 的 require 指向真正 SSR 模块。

## 首批目录

24 枚：Story、Scene、Watercolor、Character、Layers、Chat、Review、Pen、Palette、Camera、Music、Video、Sparkle、Heart、Star、Flower、Leaf、Planet、Coffee、Folder、Calendar、Lightbulb、Rocket、Gift。

## 文件与扩展

`assets/regular` 保存唯一可编辑源 SVG。五种非 regular weight 由运行时派生；`assets/catalog.json` 保存唯一命名、分类、中文名和关键词。`src/defs`、`src/csr`、`src/ssr`、入口和 catalog 为生成物。`scripts/assemble.ts --check` 检查生成物是否同步。静态导出和 Originals 压缩包会在内存中按需生成 weight 变体。

## 交付与验证

提供本地预览页：中英文搜索、分类筛选、六种 weight、尺寸、镜像、浅深主题、选中详情、复制 JSX 与导出当前 SVG。桌面与移动端布局可用；同页提供 26px 实际尺寸比较。

测试公开行为、Context 优先级、ref/事件、无障碍、六种 weight、SSR 一致性、源 SVG 有效性、生成幂等、ESM/CJS 深层导入、React server condition、tree shaking 和声明文件消费。运行构建与预览交互验证。不自动发布 npm。
