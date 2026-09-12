# Colorful. 品牌标志

Colorful. 的标志是一枚向右敞开的 C。浅紫上弧、紫色连接部和蜜桃色下弧由三块圆润的闭合曲线组成：保留图标家族的柔和叠色，也让不同颜色自然组成一个整体。没有容器底板、阴影、渐变、装饰线或外部图片。留白直接透出使用场景的背景。

## 交付文件

| 文件 | 用途 |
| --- | --- |
| `apps/web/public/brand/logo-mark.svg` | 独立品牌图形，32 × 32 viewBox |
| `apps/web/public/brand/logo.svg` | 图形与 Colorful. 字标，184 × 40；跟随系统深色偏好调整文字 |
| `apps/web/public/brand/logo-dark.svg` | 深色背景专用白色字标，184 × 40 |
| `apps/web/public/brand/favicon.svg` | 与主标志完全一致的矢量 favicon |
| `apps/web/public/brand/brand-preview.png` | 深浅背景与 16 / 24 / 32 / 64 / 120px 尺寸的渲染校样 |
| `apps/web/src/components/brand-logo.tsx` | 可复用 React 品牌组件 |

网页中可分别通过 `/brand/logo-mark.svg`、`/brand/logo.svg`、`/brand/logo-dark.svg` 和 `/brand/favicon.svg` 引用或下载文件。

## 使用方式

```tsx
import { BrandLogo } from './components/brand-logo';

<BrandLogo />
<BrandLogo className="header-brand" />
<BrandLogo wordmark={false} />
```

组件默认展示 32px 图形和字标，文字颜色及字号继承所在界面。可以通过 `.brand-logo__mark` 调整图形大小，通过 `.brand-logo__wordmark` 调整字标字号。图形保持固定三色，在浅色与深色背景上共用同一版；整体无需反色或降低透明度。

组件通过外层 `role="img" aria-label="Colorful."` 提供一次品牌名称，内部 SVG 与视觉文字对辅助技术隐藏。放入首页链接时，由链接承载跳转行为。

## 色彩与字形

| 色彩 | 色值 | 作用 |
| --- | --- | --- |
| 紫色 | `#9A79C6` | 连接部与字标句点 |
| 浅紫 | `#D9C9ED` | 上弧，与现有插画主色一致 |
| 蜜桃 | `#F2BEA7` | 下弧，提供温暖的配色对比 |
| 墨色 | `#29252F` | 浅色背景字标 |
| 暖白 | `#F7F2FA` | 深色背景字标 |

品牌图形为原创 SVG 路径，不依赖字体。React 字标使用 Inter → 系统无衬线字体回退，字重 700、字距 -0.045em。独立 SVG 使用可编辑文字，回退顺序为 Inter → Arial → Helvetica → sans-serif，字体未嵌入，因此不同设备的字形会略有差别。需要严格固定字形的印刷交付时，可在设计工具中将字标转为轮廓。

建议图形显示不小于 16px，周围至少留出图形高度四分之一的空白。字标整体按比例缩放，不压扁、旋转或改变三块色彩的相对关系。

## 校验

已用 Sharp 实际渲染所有导出 SVG，并目视检查 16 / 24 / 32 / 64 / 120px 的图形和深浅背景字标。小尺寸保持开放 C 的轮廓，路径不触及画布边界；校样保存在 `brand-preview.png`。
