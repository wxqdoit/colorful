import fs from "node:fs";
const entries = JSON.parse(fs.readFileSync("assets/catalog.json"));
const notes = new Map(
  JSON.parse(fs.readFileSync("design/redesign/catalog.json")).map((n) => [
    n.name,
    n,
  ]),
);
const data = entries.map(({ name, label, category, tags }) => ({
  name,
  label,
  category,
  tags,
  family: notes.get(name).family,
  cohort: notes.get(name).group.startsWith("symbols-")
    ? "symbols"
    : "illustrations",
  oldLabel: notes.get(name).group.startsWith("symbols-")
    ? "Phosphor 原版"
    : "圆角前",
  old: fs.readFileSync(
    fs.existsSync(`design/archive/0.3.0-regular/${name}.svg`)
      ? `design/archive/0.3.0-regular/${name}.svg`
      : `vendor/phosphor/raw/${name}.svg`,
    "utf8",
  ),
  art: fs.readFileSync(`assets/regular/${name}.svg`, "utf8"),
}));
fs.writeFileSync(
  "design/archive/site-v0.6/design-review.html",
  `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Colorful · 全量设计对照</title><link rel="stylesheet" href="/design-review.css"></head><body><main><div class="top"><a class="brand" href="/">colorful.</a><small>全量设计 / v0.6.0</small><a href="/">打开图标库 ↗</a></div><h1>物件柔软，符号也有自己的表情。</h1><p class="intro">1,519 枚图标，包括新补绘的 466 枚方向、文字、运算、功能符号与品牌标识。新增图标左侧展示 Phosphor 原版，右侧是 Colorful 重绘；原有插画保留圆角处理前后的对照。</p><div class="principles"><span><i style="background:var(--project-art-surface)"></i>浅色 · 前景与内部</span><span><i style="background:var(--project-art-back)"></i>主色 · 主体与部件</span><span><i style="background:var(--project-art-detail)"></i>深色 · 结构与识别点</span></div><div class="toolbar"><div><button data-view="compare" aria-pressed="true">设计对照</button><button data-view="new" aria-pressed="false">只看 Colorful</button></div><div><label>尺寸</label><button data-size="26" aria-pressed="false">26</button><button data-size="56" aria-pressed="true">56</button><button data-size="72" aria-pressed="false">72</button></div><div><button data-theme="light" aria-pressed="true">浅色</button><button data-theme="dark" aria-pressed="false">深色</button></div></div><div class="filters"><input id="search" type="search" aria-label="搜索图标" placeholder="搜索中文、英文或关键词…"><select id="category" aria-label="分类"><option value="">全部分类</option></select><select id="scope" aria-label="设计范围"><option value="">全部图标</option><option value="symbols">新增 466 枚符号</option><option value="illustrations">原有插画图标</option></select><span id="count"></span></div><section class="grid" data-view="compare" aria-live="polite"></section><div class="pager"><button id="prev">上一页</button><span id="page"></span><button id="next">下一页</button></div><p class="note">圆角已同步到六种样式、React 组件与 SVG 导出。主图标库可自由调配三色，也可体验初始动画、悬停动画与平滑镜像。</p></main><script id="artwork" type="application/json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script><script type="module" src="/design-review.js"></script></body></html>`,
);
console.log(`Built full comparison for ${data.length} redesigned icons.`);
