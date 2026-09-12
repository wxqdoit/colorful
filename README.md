# Colorful.

圆润的图标，一点色彩。

2,519 枚图标，含 1,000 枚 Colorful Originals · 三色主题 · 六种样式 · 分层动效

## 项目结构

```
apps/web/         官网 · React + shadcn/ui + Tailwind CSS
packages/icons/   @colorful-icons/react · 独立组件包
```

官网通过图标包的公开入口使用组件，包可独立安装和发布，不依赖官网样式。

## 开发

需要 Node.js 22+ 和 npm。

```sh
npm ci
npm run build:icons
npm run dev                 # http://127.0.0.1:5186
```

```sh
npm run build               # 依次构建图标包和官网
npm run check               # 两个工作区的检查、测试和构建
npm run pack:icons          # 生成图标包 .tgz
npm run redesign            # 从绘制源重建全部 SVG 与组件
npm run originals           # 重建原创系列
npm run pack:originals       # 打包原创系列的六种 SVG 样式
```

## 使用图标包

```tsx
import { StoryIcon } from '@colorful-icons/react/Story';

<StoryIcon size={32} preset="mint" hoverAnimation="morph" />
```

[完整 API](packages/icons/README.md) · [工作区说明](docs/monorepo.md) · [图标设计规范](packages/icons/docs/SKILL.md)

[原创系列与绘制说明](docs/originals.md)
