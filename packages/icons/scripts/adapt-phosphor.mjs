import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  rmSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import svgpath from "svgpath";
import { paper, softCorners, subpath } from "./geometry.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFileSync(resolve(root, file), "utf8");
const upstream = JSON.parse(read("vendor/phosphor/catalog.json"));
const previous = JSON.parse(read("assets/catalog.json"));
if(previous.some(icon => icon.designStatus === "redesigned")) throw new Error("Legacy geometry conversion is retired. Use npm run redesign to rebuild the authored artwork.");
const original = previous.filter((icon) => icon.source !== "phosphor");
const ownedNames = new Set(original.map((icon) => icon.name));
const ownedComponents = new Set(original.map((icon) => icon.component));
const dom = new JSDOM();
const parser = new dom.window.DOMParser();
const converted = [],
  inventory = [];
const colors = { surface: "#f0e9f8", back: "#d9c9ed", detail: "#aa8bcf" };
const categoryMap = {
  nature: "自然",
  weather: "天气",
  objects: "物件",
  "maps & travel": "旅行",
  people: "人物",
  "health & wellness": "健康",
  games: "游戏",
  commerce: "商业",
  finances: "财务",
  communications: "沟通",
  media: "媒体",
  office: "办公",
  "technology & development": "科技",
  system: "系统",
  design: "设计",
  editor: "编辑",
};
const labels = {
  acorn: "橡果",
  airplane: "飞机",
  "air-traffic-control": "空中管制",
  anchor: "船锚",
  apple: "苹果",
  backpack: "背包",
  balloon: "气球",
  barn: "谷仓",
  basketball: "篮球",
  bathtub: "浴缸",
  battery: "电池",
  bed: "床",
  bell: "铃铛",
  bicycle: "自行车",
  bird: "小鸟",
  boat: "船",
  book: "书本",
  bowl: "碗",
  brain: "大脑",
  bridge: "桥梁",
  briefcase: "公文包",
  butterfly: "蝴蝶",
  cactus: "仙人掌",
  cake: "蛋糕",
  campfire: "篝火",
  car: "汽车",
  carrot: "胡萝卜",
  castle: "城堡",
  cat: "猫",
  chair: "椅子",
  champagne: "香槟",
  cherries: "樱桃",
  church: "教堂",
  cloud: "云朵",
  clover: "三叶草",
  compass: "指南针",
  computer: "电脑",
  cookie: "饼干",
  cow: "奶牛",
  crown: "王冠",
  cube: "立方体",
  desk: "书桌",
  diamond: "钻石",
  dog: "狗",
  door: "门",
  dress: "连衣裙",
  egg: "鸡蛋",
  envelope: "信封",
  factory: "工厂",
  feather: "羽毛",
  file: "文件",
  film: "胶片",
  fire: "火焰",
  fish: "鱼",
  flag: "旗帜",
  flashlight: "手电筒",
  flask: "烧瓶",
  flower: "花朵",
  football: "橄榄球",
  fork: "餐叉",
  funnel: "漏斗",
  game: "游戏",
  ghost: "幽灵",
  globe: "地球",
  guitar: "吉他",
  hamburger: "汉堡",
  hand: "手势",
  handbag: "手袋",
  headphones: "耳机",
  headset: "头戴耳机",
  horse: "马",
  hospital: "医院",
  hourglass: "沙漏",
  house: "房屋",
  "ice-cream": "冰淇淋",
  island: "岛屿",
  jar: "罐子",
  joystick: "摇杆",
  key: "钥匙",
  keyboard: "键盘",
  knife: "刀",
  lamp: "台灯",
  laptop: "笔记本电脑",
  lighthouse: "灯塔",
  lightning: "闪电",
  lock: "锁",
  map: "地图",
  medal: "奖牌",
  microphone: "麦克风",
  monitor: "显示器",
  moon: "月亮",
  mountains: "山峦",
  mouse: "鼠标",
  mushroom: "蘑菇",
  newspaper: "报纸",
  notebook: "笔记本",
  orange: "橙子",
  oven: "烤箱",
  package: "包裹",
  paint: "绘画",
  paper: "纸张",
  parachute: "降落伞",
  paw: "爪印",
  peach: "桃子",
  pear: "梨",
  pencil: "铅笔",
  pepper: "辣椒",
  phone: "电话",
  piano: "钢琴",
  piggy: "储蓄罐",
  pill: "药片",
  pizza: "披萨",
  plant: "植物",
  potted: "盆栽",
  printer: "打印机",
  puzzle: "拼图",
  rabbit: "兔子",
  rainbow: "彩虹",
  robot: "机器人",
  sailboat: "帆船",
  scissors: "剪刀",
  shield: "盾牌",
  shirt: "衬衫",
  shopping: "购物",
  shower: "淋浴",
  shrimp: "虾",
  skull: "骷髅",
  smiley: "笑脸",
  snowflake: "雪花",
  sock: "袜子",
  speaker: "音箱",
  squirrel: "松鼠",
  stamp: "印章",
  suitcase: "行李箱",
  sun: "太阳",
  sunglasses: "太阳镜",
  tent: "帐篷",
  ticket: "票券",
  timer: "计时器",
  toilet: "马桶",
  toolbox: "工具箱",
  tooth: "牙齿",
  tornado: "龙卷风",
  train: "火车",
  trash: "垃圾桶",
  tree: "树",
  trophy: "奖杯",
  truck: "卡车",
  umbrella: "雨伞",
  user: "用户",
  users: "用户组",
  van: "货车",
  vase: "花瓶",
  vinyl: "唱片",
  wallet: "钱包",
  watch: "手表",
  waves: "波浪",
  webcam: "摄像头",
  wind: "风",
  wine: "葡萄酒",
  wrench: "扳手",
};
const abstract =
  /^(?:cell-signal|x|at|hash|check|checks|code|currency|gender|copyright|copyleft|trademark|letter-circle|command|control|option|quotes|signature|translate|bluetooth|approximate-equals|binary|empty|member-of|not-member-of|not-subset-of|not-superset-of|radical|tilde|vector|line-vertical|angle|bezier-curve|arrow|arrows|caret|text|number|math|sigma|pi|function|plus|minus|equals|not-equals|greater|less|divide|percent|asterisk|bracket|brackets|superset|subset|intersection|intersect|union|subtract|exclude|align|selection|bounding-box|crop|resize|corners|line-segment|line-segments|dots|dot|cursor|text-align|text-indent|text-outdent)(?:-|$)/;
const primitives =
  /^(?:circle|square|rectangle|triangle|pentagon|hexagon|octagon|polygon)(?:-|$)/;

function shapeData(node) {
  const n = (name) => Number(node.getAttribute(name) ?? 0);
  switch (node.localName) {
    case "path":
      return node.getAttribute("d");
    case "circle": {
      const x = n("cx"),
        y = n("cy"),
        r = n("r");
      return `M${x + r} ${y}A${r} ${r} 0 1 1 ${x - r} ${y}A${r} ${r} 0 1 1 ${x + r} ${y}Z`;
    }
    case "ellipse": {
      const x = n("cx"),
        y = n("cy"),
        rx = n("rx"),
        ry = n("ry");
      return `M${x + rx} ${y}A${rx} ${ry} 0 1 1 ${x - rx} ${y}A${rx} ${ry} 0 1 1 ${x + rx} ${y}Z`;
    }
    case "rect": {
      const x = n("x"),
        y = n("y"),
        w = n("width"),
        h = n("height"),
        r = Math.min(n("rx") || n("ry"), w / 2, h / 2);
      return `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
    }
    case "line":
      return `M${n("x1")} ${n("y1")}L${n("x2")} ${n("y2")}`;
    case "polygon":
    case "polyline":
      return `M${node
        .getAttribute("points")
        .trim()
        .replace(/[\s,]+/g, " ")}${node.localName === "polygon" ? "Z" : ""}`;
    default:
      return null;
  }
}
function paths(item) {
  return item.children ? item.children.flatMap(paths) : [item];
}
function parse(source) {
  const document = parser.parseFromString(source, "image/svg+xml");
  if (document.querySelector("parsererror"))
    throw new Error("Invalid source XML");
  return [
    ...document.querySelectorAll(
      "path,circle,ellipse,rect,line,polyline,polygon",
    ),
  ].flatMap((node) => {
    if (
      node.localName === "rect" &&
      node.getAttribute("width") === "256" &&
      node.getAttribute("height") === "256"
    )
      return [];
    let transform = "",
      opacity = 1,
      parent = node;
    while (parent && parent.localName !== "svg") {
      transform = `${parent.getAttribute("transform") ?? ""} ${transform}`;
      if (parent.hasAttribute("opacity"))
        opacity *= Number(parent.getAttribute("opacity"));
      parent = parent.parentElement;
    }
    const data = shapeData(node);
    if (!data) return [];
    const normalized = svgpath(data)
      .transform(transform.trim())
      .scale(24 / 256)
      .round(5)
      .toString();
    const p = paper.PathItem.create(normalized);
    return [
      {
        p,
        filled: node.getAttribute("fill") !== "none",
        stroked: node.hasAttribute("stroke"),
        opacity,
      },
    ];
  });
}
function pathSVG(p, color, line = false) {
  const d = p.getPathData(null, 3);
  return line
    ? `  <path d="${d}" fill="none" data-layer="detail" />`
    : `  <path d="${d}" fill="var(--project-art-${color}, ${colors[color]})" stroke="none" data-layer="${color}" />`;
}
function category(icon) {
  const order = [
    "nature",
    "weather",
    "people",
    "health & wellness",
    "maps & travel",
    "games",
    "commerce",
    "communications",
    "media",
    "office",
    "technology & development",
    "objects",
    "finances",
    "design",
    "system",
    "editor",
  ];
  return categoryMap[order.find((c) => icon.categories.includes(c))] ?? "物件";
}
function label(icon) {
  if (labels[icon.name]) return labels[icon.name];
  const first = icon.name.split("-")[0];
  return labels[first]
    ? `${labels[first]} · ${icon.name.slice(first.length + 1).replaceAll("-", " ")}`
    : icon.name
        .split("-")
        .map((s) => s[0].toUpperCase() + s.slice(1))
        .join(" ");
}

for (const icon of upstream) {
  let reason;
  if (ownedNames.has(icon.name) || ownedComponents.has(icon.pascal_name)) {
    inventory.push({
      name: icon.name,
      status: "existing",
      reason: "使用已绘制的 Colorful 同名图标",
      component: icon.pascal_name,
    });
    continue;
  }
  if (icon.categories.includes("brands") || /-logo$/.test(icon.name))
    reason = "品牌标识，不改写品牌形状";
  else if (abstract.test(icon.name) || primitives.test(icon.name))
    reason = "纯方向、文字、运算或编辑几何，缺少插画物件语义";
  else if (icon.categories.every((c) => c === "arrows" || c === "editor"))
    reason = "仅方向或排版编辑语义，保留为功能符号";
  if (reason) {
    inventory.push({ name: icon.name, status: "excluded", reason });
    continue;
  }
  paper.project.activeLayer.removeChildren();
  const shapes = parse(read(`vendor/phosphor/raw/${icon.name}.svg`));
  if (!shapes.length) throw new Error(`No geometry: ${icon.name}`);
  let bounds = shapes[0].p.bounds.clone();
  for (const shape of shapes) bounds = bounds.unite(shape.p.bounds);
  const factor = 20 / Math.max(bounds.width, bounds.height),
    center = bounds.center;
  shapes.forEach(({ p }) => {
    p.scale(factor, new paper.Point(0, 0));
    p.translate(
      new paper.Point(12 - center.x * factor, 12 - center.y * factor),
    );
  });
  const surfaces = shapes
    .filter((s) => s.filled && s.opacity < 1)
    .map((s) => s.p.clone({ insert: false }));
  // Recover closed physical parts absent from the duotone fill (e.g. acorn cap).
  for (const { p, stroked } of shapes) {
    if (
      !stroked ||
      !paths(p).every((path) => path.closed) ||
      Math.abs(p.area) < 18
    )
      continue;
    let overlap = 0;
    for (const surface of surfaces) {
      const hit = p.intersect(surface, { insert: false });
      overlap += Math.abs(hit.area);
      hit.remove();
    }
    if (overlap / Math.abs(p.area) < 0.15)
      surfaces.push(p.clone({ insert: false }));
  }
  if (
    !surfaces.length ||
    surfaces.reduce((sum, p) => sum + Math.abs(p.area), 0) < 20
  ) {
    inventory.push({
      name: icon.name,
      status: "excluded",
      reason: "原始矢量缺少足够的封闭主体色块",
    });
    continue;
  }
  // Prefer the full physical outline when a duotone region contains cut-outs
  // (camera lens / nested flame). This also avoids tangent-hole boolean seams.
  for (let i = 0; i < surfaces.length; i++) {
    for (const { p, stroked } of shapes) {
      if (
        !stroked ||
        !paths(p).every((path) => path.closed) ||
        Math.abs(p.area) < Math.abs(surfaces[i].area) * 1.05
      )
        continue;
      const overlap = p.intersect(surfaces[i], { insert: false });
      if (Math.abs(overlap.area) > Math.abs(surfaces[i].area) * 0.92) {
        surfaces[i] = p.clone({ insert: false });
        break;
      }
    }
  }
  let silhouette = surfaces[0].clone({ insert: false });
  for (const surface of surfaces.slice(1)) {
    const merged = silhouette.unite(surface, { insert: false });
    silhouette.remove();
    silhouette = merged;
  }
  if (!Number.isFinite(silhouette.area) || Math.abs(silhouette.area) < 12)
    throw new Error(
      `Invalid silhouette: ${icon.name}; area=${silhouette.area}; parts=${surfaces.map((s) => s.area).join(",")}`,
    );
  softCorners(silhouette);
  if (silhouette.children)
    [...silhouette.children]
      .filter((p) => Math.abs(p.area) < 0.02)
      .forEach((p) => p.remove());
  const b = silhouette.bounds;
  const seed = [...icon.name].reduce((n, c) => n + c.charCodeAt(0), 0);
  // The second color is a curved region INSIDE the object's own silhouette.
  // It changes direction by shape proportions; there is no external blob/badge.
  const y = b.top + b.height * 0.56;
  const cut = new paper.Path(
    `M${b.left - 1} ${y}C${b.left + b.width * 0.28} ${y - b.height * 0.3} ${b.left + b.width * 0.65} ${y + b.height * 0.26} ${b.right + 1} ${y - b.height * 0.04}L${b.right + 1} ${b.bottom + 1}L${b.left - 1} ${b.bottom + 1}Z`,
  );
  if (b.height > b.width * 1.45 || seed % 3 === 1) cut.rotate(90, b.center);
  else if (seed % 3 === 2) cut.rotate(-18, b.center);
  let back = silhouette.intersect(cut, { insert: false });
  if (surfaces.length > 1) {
    const part = surfaces
      .slice()
      .sort((a, b) => Math.abs(a.area) - Math.abs(b.area))[0];
    if (
      Math.abs(part.area) / Math.abs(silhouette.area) > 0.12 &&
      Math.abs(part.area) / Math.abs(silhouette.area) < 0.7
    )
      back = part;
  }
  // Click variants encode their meaning through the highlighted physical part.
  if (/^mouse-(left|right)-click$/.test(icon.name)) {
    const highlight = shapes.find((s) => s.filled && s.opacity < 1);
    if (highlight) back = silhouette.intersect(highlight.p, { insert: false });
  }
  if (Math.abs(back.area) < 1)
    throw new Error(`Missing main color region: ${icon.name}`);
  const lines = [];
  const outlines = shapes.filter((s) => s.stroked).flatMap((s) => paths(s.p));
  for (const line of outlines) {
    const length = line.length;
    if (length < 0.4) continue;
    const steps = Math.max(8, Math.ceil(length / 0.4));
    const interior = [];
    for (let i = 0; i <= steps; i++) {
      const at = (length * i) / steps,
        point = line.getPointAt(Math.min(at, length - 0.00001));
      const nearest = silhouette.getNearestPoint(point);
      interior.push(point.getDistance(nearest) > 0.38);
    }
    const ratio = interior.filter(Boolean).length / interior.length;
    if (ratio > 0.85) {
      lines.push(line.clone({ insert: false }));
      continue;
    }
    if (ratio < 0.12) continue;
    let start = -1;
    for (let i = 0; i <= steps + 1; i++) {
      if (interior[i] && start < 0) start = i;
      if (!interior[i] && start >= 0) {
        const a = (length * start) / steps,
          z = (length * (i - 1)) / steps;
        if (z - a > 1.2) {
          const section = subpath(line, a, z);
          if (section) lines.push(section);
        }
        start = -1;
      }
    }
  }
  const details = shapes
    .filter((s) => s.filled && s.opacity === 1 && !s.stroked)
    .map((s) => s.p);
  if (!lines.length && !details.length && outlines.length) {
    const longest = outlines.slice().sort((a, b) => b.length - a.length)[0];
    const section = subpath(
      longest,
      longest.length * 0.1,
      longest.length * 0.26,
    );
    if (section) lines.push(section);
  }
  // Preserve the most informative structures without dense perimeter tracing.
  const meaningful = lines.sort((a, b) => b.length - a.length).slice(0, 5);
  const content = [
    pathSVG(silhouette, "surface"),
    pathSVG(back, "back"),
    ...details.map((p) => pathSVG(p, "detail")),
    ...meaningful.map((p) => pathSVG(p, "detail", true)),
  ].join("\n");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--project-art-detail, #aa8bcf)" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">\n${content}\n</svg>\n`;
  writeFileSync(resolve(root, `assets/regular/${icon.name}.svg`), svg);
  converted.push({
    name: icon.name,
    component: icon.pascal_name,
    label: label(icon),
    category: category(icon),
    tags: [...icon.tags.filter((t) => t !== "*new*"), ...icon.categories],
    source: "phosphor",
  });
  inventory.push({
    name: icon.name,
    status: "adapted",
    reason: "封闭主体重建、三色分层、削减外描边并保留结构细节",
    component: icon.pascal_name,
    sourceCategories: icon.categories,
  });
}
for (const old of previous.filter(
  (i) => i.source === "phosphor" && !converted.some((n) => n.name === i.name),
)) {
  rmSync(resolve(root, `assets/regular/${old.name}.svg`), { force: true });
  for (const kind of ["defs", "csr", "ssr"])
    rmSync(resolve(root, `src/${kind}/${old.component}.tsx`), { force: true });
}
writeFileSync(
  resolve(root, "assets/catalog.json"),
  JSON.stringify([...original, ...converted], null, 2) + "\n",
);
const summary = {
  reactRevision: "81ac06f9bf4b4dedf9b8fead0a1ebd47c41d67ef",
  coreRevision: "b7deeb195790ae085c7fc58e5bc7f163ff3ca088",
  reviewed: upstream.length,
  adapted: converted.length,
  existing: inventory.filter((i) => i.status === "existing").length,
  excluded: inventory.filter((i) => i.status === "excluded").length,
  total: original.length + converted.length,
};
mkdirSync(resolve(root, "docs/catalog"), { recursive: true });
writeFileSync(
  resolve(root, "docs/catalog/phosphor-coverage.json"),
  JSON.stringify({ summary, icons: inventory }, null, 2) + "\n",
);
writeFileSync(
  resolve(root, "docs/catalog/phosphor-coverage.md"),
  `# Phosphor 全目录改造记录\n\n审阅 ${summary.reviewed} 枚：改造 ${summary.adapted} 枚，${summary.existing} 枚沿用已绘制版本，排除 ${summary.excluded} 枚。Colorful 合计 ${summary.total} 枚。\n\n来源固定到 core \`${summary.coreRevision}\`。使用逐文件矢量结构分析筛选；自动几何改造后进行分类抽样视觉检查，并非声称每枚都独立手绘。\n\n| 上游名称 | 结论 | 依据 |\n| --- | --- | --- |\n` +
    inventory
      .map(
        (i) =>
          `| ${i.name} | ${{ adapted: "已改造", existing: "已有自绘", excluded: "不适合" }[i.status]} | ${i.reason} |`,
      )
      .join("\n") +
    "\n",
);
console.log(JSON.stringify(summary, null, 2));
dom.window.close();
paper.project.remove();
