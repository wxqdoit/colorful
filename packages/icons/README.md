# colorful.

圆润色块与细线结合的 React 插画图标库。基于 [Colorful 图标系统设计规范 (1.2)](docs/design/design-specification.md)，按照 [Phosphor React](https://github.com/phosphor-icons/react) 的实现架构构建。

**v0.7.0 / Colorful Originals：** 新增 1,000 枚原创插画图标，保留已有 1,519 枚。统一支持三色主题、六种样式、圆润造型与分层动效。原创组件使用 `Original` 前缀，每项的造型说明保存在 `design/originals/catalog.json`。

- 2,519 枚基础图标；六种 weight 在渲染时从 regular artwork 派生，静态 Originals 压缩包另行提供 6,000 个 SVG。`assets/regular` 是仓库内的编辑源，不随 React 主包发布。
- TypeScript、`forwardRef`、`IconContext`、任意 SVG props 和 children。
- 独立 CSR / SSR 入口、按需导入、ESM / CJS / UMD，React 外置。
- 严格使用三种语义颜色，提供八套浅色 / 深色配色及自由调色。
- 支持初始动画、hover 动画和平滑镜像过渡；预览页按需加载、分页检索、复制 JSX 和导出静态 SVG。

## 开发与构建

本包位于 Colorful monorepo 的 `packages/icons`，官网位于 `apps/web`。从仓库根目录运行：

```sh
npm ci
npm run build:icons
npm run dev              # http://127.0.0.1:5186
```

在本包目录运行：

```sh
npm run check            # 资产、类型、测试、构建与打包消费检查
npm run build            # ESM / CJS / UMD / 类型文件
npm pack                 # colorful-icon-react-0.7.2.tgz
```

包名为 `@colorful-icon/react`，已发布到 npm。推荐直接安装：

```sh
npm install @colorful-icon/react
```

如需从本地构建文件安装：

```sh
npm install /path/to/colorful/colorful-icon-react-0.7.2.tgz
```

## 使用

```tsx
import { StoryIcon, SceneIcon, WatercolorIcon } from "@colorful-icon/react";

export function CreationTools() {
  return <div>
    <StoryIcon />
    <SceneIcon size={32} theme="dark" />
    <WatercolorIcon weight="duotone" palette={{ detail: "#769b8c" }} />
  </div>;
}
```

每枚图标同时导出 `StoryIcon` 和 `Story`。推荐使用带 `Icon` 后缀的名称。

### 按图标导入

```tsx
import { StoryIcon } from "@colorful-icon/react/Story";
// 与上游路径形式对齐：
import { SceneIcon } from "@colorful-icon/react/dist/csr/Scene";
```

根入口可 tree-shake。产品代码避免导入整个图标命名空间；预览页通过按图标动态加载和每页 48 枚控制加载量。

### Props

| 属性 | 类型 | 默认值 / 作用 |
| --- | --- | --- |
| `size` | `number \| string` | `26`，同时设置 width / height |
| `weight` | `thin \| light \| regular \| bold \| fill \| duotone` | `regular` |
| `color` | `string` | 覆盖细节色，不覆盖主体两层填色 |
| `mirrored` | `boolean` | `false`，沿自身中心水平翻转；自动注册过渡样式 |
| `motionStyles` | `auto \| manual` | `auto`，有动效时自动注册样式；可由 IconContext 全局设置 |
| `preset` | `lavender \| mint \| peach \| ocean \| rose \| sand \| graphite \| tangerine` | `lavender` |
| `entrance` | `none \| pop \| rise \| fade` | `none`，挂载时的初始动画 |
| `hoverAnimation` | `none \| lift \| wiggle \| pulse \| spread \| morph` | `none`，各部件分层运动 |
| `hoverEasing` | `smooth \| gentle \| snappy \| spring \| linear` | `spring`，悬停及归位缓动 |
| `hoverDuration` / `hoverStagger` | `number` | 动作时长 900 / 层间延迟 65，单位 ms |
| `hoverReplayKey` | `string \| number` | 改变时重播整套 hover 动作，保留 SVG/ref |
| `animationKey` | `string \| number` | 改变时重播初始动画，不重挂载 SVG 根元素 |
| `animationDuration` / `animationDelay` | `number` | 初始动画时长 560 / 延迟 0，单位 ms |
| `mirrorDuration` | `number` | 镜像过渡时长 320 ms |
| `alt` | `string` | 生成 title，提供可访问名称 |
| `theme` | `light \| dark` | 不传则继承 CSS token，缺省回退浅色 |
| `palette` | `IconPalette` | 按语义颜色逐项覆盖 |
| `style` | `IconStyle` | 常规 CSS 属性与 `--project-art-*` 变量 |
| `ref` | `Ref<SVGSVGElement>` | 指向根 SVG |

原生 SVG props（例如 `width`、`height`、`className`、`aria-label`、`onClick`）照常透传。children 位于 artwork 前面的 DOM 顺序，作为图形背后的 SVG 内容。坐标系为 `0 0 24 24`。

装饰图标默认 `aria-hidden="true"`、`focusable="false"`。传入 `alt`、`aria-label` 或 `aria-labelledby` 后默认以 `role="img"` 暴露名称；显式 ARIA 属性可覆盖。图标按钮的名称应放在按钮上：

```tsx
<button aria-label="新建故事"><StoryIcon /></button>
<StoryIcon alt="故事策划" />
```

### Context 与主题

新增配色均支持 `theme="light"` / `"dark"`，也可继续用 `palette` 覆盖其中任意颜色：

| 预设 | 配色 | 浅色主题：浅层 / 主色块 / 细节 |
| --- | --- | --- |
| `graphite` | 石墨黑灰 | `#e5e5e5` / `#a3a3a3` / `#262626` |
| `tangerine` | 橙柠撞色 | `#deee91` / `#ff984d` / `#63851f` |

```tsx
import { IconContext, StoryIcon, SceneIcon } from "@colorful-icon/react";

<IconContext.Provider value={{ size: 32, theme: "dark", mirrored: true }}>
  <StoryIcon />
  <SceneIcon size={26} mirrored={false} />
</IconContext.Provider>
```

采用最近的 Provider；显式组件 props 优先（包括 `false`、`0`、空字符串），`undefined` 表示继承。`palette`、`style` 逐项合并。

颜色优先级：主题默认色 → Provider palette → 组件 palette；`color` 覆盖 detail，组件 `palette.detail` 可覆盖继承的 `color`。最后叠加 Provider style 和组件 style，允许显式 CSS token 覆盖 prop 颜色。

默认无需导入 CSS。需要在 HTML 祖先上切换主题时可使用可选样式表：

```tsx
import "@colorful-icon/react/theme.css";
<section data-colorful-theme="dark"><StoryIcon /></section>
```

| Token | 浅色 | 深色 |
| --- | --- | --- |
| `--project-art-surface` | `#f0e9f8` | `#746188` |
| `--project-art-back` | `#d9c9ed` | `#af94ca` |
| `--project-art-detail` | `#aa8bcf` | `#efdcfa` |

`palette` 使用不带前缀的键，如 `{ surface, back, detail }`。`palettes.light` / `palettes.dark` 导出浅紫默认值；`palettePresets[preset][theme]` 导出指定配色的三色值。旧版 `outline` / `stripe` / `accent` props 仅兼容映射到 detail，不再产生额外颜色。显式 `theme` 在 SVG 上设置变量，会覆盖祖先主题。

### 配色与动画

| preset | 名称 | 浅色块 / 主色块 / 细节线（浅色主题） |
| --- | --- | --- |
| lavender | 浅紫梦境 | #f0e9f8 / #d9c9ed / #aa8bcf |
| mint | 薄荷花园 | #e5f2e9 / #afd5c2 / #548b76 |
| peach | 蜜桃日落 | #fff0e6 / #f2c0aa / #c77f70 |
| ocean | 海盐晴空 | #e8f0fa / #b6cfea / #668caf |
| rose | 玫瑰奶霜 | #f9e9ef / #e8b9cb / #b26e92 |
| sand | 暖杏午后 | #f7f0dc / #e6d09f / #a48b52 |

```tsx
import { useState } from "react";
import { BirdIcon, IconContext } from "@colorful-icon/react";

function Example() {
  const [mirrored, setMirrored] = useState(false);
  const [replay, setReplay] = useState(0);
  return <IconContext.Provider value={{ preset: "mint", entrance: "pop", hoverAnimation: "lift", hoverEasing: "spring", hoverDuration: 700, hoverStagger: 50 }}>
    <button data-colorful-hover-target onClick={() => setMirrored(v => !v)} aria-label="翻转小鸟">
      <BirdIcon mirrored={mirrored} animationKey={replay} />
    </button>
    <button onClick={() => setReplay(n => n + 1)}>重播</button>
    <BirdIcon palette={{ surface: "#fff0e6", back: "#f2c0aa", detail: "#c77f70" }} />
  </IconContext.Provider>;
}
```

动效样式默认自动注册，无需额外 import。静态图标不创建动效样式节点；样式文本随共享运行时打包（约 6 KB），不发起额外 CSS 请求。React 19 在服务端和客户端通过样式资源去重；React 18 客户端在绘制前注册一次。镜像与初始动画保留独立 SVG group；hover 的外层保持静止，每个 SVG 部件使用独立包装层，按后层、主体、细节设置不同幅度与错峰延迟，保持原始叠放顺序和部件变换。主包的 `morph` 使用轻量 scale fallback，以避免为每枚图标携带重复的变形轮廓；完整轮廓形变仍可由 `scripts/motion-layers.ts` 在生成工具中按需启用。`lift` 轻跃登场、`wiggle` 俏皮摇摆、`pulse` 气泡鼓起、`spread` 纸片绽放。每个动作经历蓄力、释放、两次收小的回摆和落定，播放一次后恢复原形，可反复触发；提前移开会从当前姿态平滑收回。`hoverEasing` 和 `hoverDuration` 控制动作节奏，提前退出的归位最长 320ms，`hoverStagger` 控制进入时的层间延迟。`data-colorful-hover-target` 让整个按钮的 hover / 键盘焦点触发图标动画；直接悬停 SVG 也可触发。自动尊重 `prefers-reduced-motion`，关闭动画并保留最终镜像方向。客户端使用原生 Web Animations 编排部件，不逐帧更新 React。纯 SSR 入口保留 CSS 过渡回退；完整分段编排使用客户端组件，初始动画在浏览器加载样式后播放。

需要手动管理样式时，在应用入口引入一次 CSS，并关闭自动注册：

```tsx
import "@colorful-icon/react/motion.css";
import { IconContext } from "@colorful-icon/react";

<IconContext.Provider value={{ motionStyles: "manual" }}>
  <App />
</IconContext.Provider>
```

React 18 服务端没有样式资源去重能力。需要动效首屏在 hydration 前就具有样式时，在文档 `<head>` 放一次 `<MotionStyles />`（从 `@colorful-icon/react/ssr` 导入），客户端会复用它；也可以使用上面的手动 CSS 模式。纯 React 18 SSR 页面同样使用这两种方式之一。React 19 自动处理 SSR 样式及 hydration，无需根级组件。SSR 规则依据 [React 样式资源文档](https://react.dev/reference/react-dom/components/style)。

预览页导出的 SVG 会固化当前三色、尺寸、weight 和镜像，移除动画；需要动态效果时复制 JSX。

### 批量来源与精修

`vendor/phosphor/raw` 保存固定版本的原始 duotone SVG，`vendor/phosphor/catalog.json` 保存完整元数据。运行 `npm run adapt:phosphor` 可复现筛选和常规版本转换，再运行 `npm run assemble` 生成组件；六种 weight 在渲染器中按需派生。

转换提取物件轮廓、柔化直角、将曲线主色层裁入主体、保留少量结构线；纯文字、方向、数学、品牌和缺少主体的符号会排除。每枚都有来源、标签和筛选依据。若精修改编图标的 regular SVG，应先从该条 metadata 移除 `source: "phosphor"`，使再次批量转换时保留该自绘版本。

### SSR / React Server Components

```tsx
import { StoryIcon } from "@colorful-icon/react/ssr";
// 或只加载一个服务端模块：
import { SceneIcon } from "@colorful-icon/react/dist/ssr/Scene";

export default function Page() {
  return <StoryIcon size={32} theme="dark" alt="故事" />;
}
```

SSR 模块不引用 `createContext` / `useContext`，不继承 `IconContext`；可传显式 props 或通过祖先 CSS 变量配色。CSR 模块及 Context 保留 `"use client"` 边界。ESM、CJS 的 SSR 入口均指向真实 SSR 实现。

### UMD

`dist/index.umd.js` 可通过普通 `<script>` 加载，在已提供 `window.React` 的页面上暴露 `window.Colorful`。它包含所有图标，不做按需裁剪。

## 与 Phosphor 对齐的实现

```text
assets/regular/*.svg + assets/catalog.json（仓库源文件）
              ↓ scripts/assemble.ts
src/defs/*.tsx           每枚图标一份 regular artwork
src/csr/*.tsx            forwardRef → IconBase → Context + SVG
src/ssr/*.tsx            forwardRef → SSRBase → SVG
              ↓ Vite preserveModules + declarations
dist/                   ESM / CJS / UMD / .d.ts / .d.cts
```

保留基类、自定义图标扩展、六种 weight、同名别名、根入口和深层入口。`src/lib/render.tsx` 共用输出逻辑，确保 CSR / SSR 在相同显式 props 下产生相同标记。静态 JSX 放在模块顶层，不在每次渲染时重新创建路径集合。

**为项目风格做的差异：**

| 项目 | Phosphor | Colorful |
| --- | --- | --- |
| 坐标与默认尺寸 | 256 单位 / 1em | 24 单位 / 26px，与 docs 一致 |
| 默认配色 | currentColor 单色 | 多层语义色块 + 少量细线 |
| color | 主体颜色 | 细节色；主体用 palette / CSS token |
| weight 图形 | 每种独立设计的线性/填充图形 | 从 regular 主体派生，可逐枚覆盖 |
| thin/light/regular/bold | 不同轮廓厚度 | 结构线宽 0.45 / 0.75 / 1.1 / 1.8 |
| fill | 单色填充 | 饱满色块，保留全部识别结构与细节 |
| duotone | 主体 + 半透明层 | surface + detail 两个色阶 |
| 资产管理 | 独立 core 子模块 | 本仓库可编辑 SVG + catalog |

目录包含 Phosphor 全部 1,512 个语义与 7 个项目专属图标。当前 1,519 枚由显式绘制的物件族、功能符号族与状态变体生成。新增方向与布局 141 枚、文字与运算 141 枚、品牌标识 79 枚、其他功能符号 105 枚；不适合插画的语义使用开放笔画和有意义的局部分色。完整覆盖及历史选取记录见 [目录清单](docs/catalog/phosphor-coverage.md)。旧版自动转换稿已归档；新生成器不读取上游路径，不使用随机切面或通用回退形状。各族共享合理的主体结构，每个名称都有对应的设计说明。

## 新增或精修图标

圆角是实际路径几何：色块默认0.65单位，描线中心路径默认0.8单位，按相邻部件长度限制切入量。已经平滑的圆弧保留原样。极小语义标记可以在绘制源上使用正数 `data-round-radius` 作光学校正，生成时删除这个制作属性。`npm run test:roundness` 会在内存中检查 regular 与六种运行时派生样式的转角、圆头与圆角矩形；新增形状不能靠只设置 `stroke-linejoin` 绕过检查。

当前目录的可维护源文件位于 `design/redesign`。修改对应分组生成器后运行 `npm run redesign`，会更新 regular、设计记录、组件和对照页。`adapt:phosphor` 作为兼容命令转向此流程，旧几何转换器会拒绝覆盖已重绘资产。独立新增图标时，也应补上分组分配和设计记录。

1. 根据 [风格规范](docs/SKILL.md) 绘制 `assets/regular/your-icon.svg`：24 单位、透明背景、token 带回退值、填色块显式 `stroke="none"`。
2. 在 `assets/catalog.json` 添加唯一的 `name`（kebab-case）、`component`（PascalCase）、中文 `label`、`category`、`tags`。
3. 运行 `npm run assemble`，生成组件、全部导出；weight 变体由渲染器按需派生。预览页读取生成的 catalog。
4. 如果某枚图标需要偏离通用 weight 派生规则，应在 regular 源中调整几何；静态 SVG 导出由共享派生工具按需生成。
5. 运行 `npm run check`，并在预览页检查 26px、放大、浅色与深色效果。

不要直接编辑带 `GENERATED FILE` 的组件或派生 SVG。删除 catalog 项后，脚本会指出待清理的旧生成文件。`assemble:check` 用于 CI 检查生成结果同步。

仓库中的原始 SVG 可直接用 `<img src="...">`；CSS 变量不能穿透 `<img>`，需要改用内联 SVG，或从预览页下载带固定主题色的版本。原始编辑资产不随 React 主包发布。

### 自定义 React 图标

```tsx
import { forwardRef } from "react";
import type { ReactElement } from "react";
import { IconBase, type Icon, type IconWeight } from "@colorful-icon/react";

const artwork = <>
  <path d="M4 8Q4 4 8 4H16Q20 4 20 8V16Q20 20 16 20H8Q4 20 4 16Z"
    fill="var(--project-art-surface, #f0e9f8)" stroke="none" />
  <path d="M5 13Q12 8 19 13V17Q19 19 16 19H8Q5 19 5 17Z"
    fill="var(--project-art-back, #d9c9ed)" stroke="none" />
  <path d="M8 8h5" />
</>;
const weights = new Map<IconWeight, ReactElement>([["regular", artwork]]);
export const CustomIcon: Icon = forwardRef((props, ref) =>
  <IconBase ref={ref} {...props} weights={weights} />
);
CustomIcon.displayName = "CustomIcon";
```

与上游一样，缺少的 weight 不绘制 artwork。正式入库应提供六个定义；服务端自定义组件从 `/ssr` 导入 `SSRBase`。

## 首批目录

| 分类 | 图标 |
| --- | --- |
| 创作 | Story、Scene、Watercolor、Character、Layers、Review、Pen、Palette、Sparkle、Lightbulb |
| 常用 | Chat、Heart、Star、Folder、Calendar、Rocket |
| 媒体 | Camera、Music、Video |
| 自然 | Flower、Leaf、Planet |
| 生活 | Coffee、Gift |

## 许可

MIT。架构参考版本与署名见 [NOTICE.md](NOTICE.md)，许可原文见 [LICENSE](LICENSE)。
