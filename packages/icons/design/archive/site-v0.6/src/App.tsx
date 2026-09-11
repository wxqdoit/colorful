import { useEffect, useRef, useState } from "react";
import {
  IconContext,
  palettePresets,
  type IconTheme,
  type IconWeight,
  type IconPreset,
  type IconPalette,
  type IconEntrance,
  type IconHover,
  type IconEasing,
} from "../../src/lib";
import { StoryIcon } from "../../src/csr/Story";
import { SceneIcon } from "../../src/csr/Scene";
import { WatercolorIcon } from "../../src/csr/Watercolor";
import { FlowerIcon } from "../../src/csr/Flower";
import { SparkleIcon } from "../../src/csr/Sparkle";
import { PlanetIcon } from "../../src/csr/Planet";
import { FolderIcon } from "../../src/csr/Folder";
import { iconCatalog } from "../../src/catalog";
import { CatalogIcon } from "./icons";
import { downloadSVG, standaloneSVG } from "./export";
import "../../src/motion.css";

const categories = [
  "全部",
  ...new Set(iconCatalog.map((icon) => icon.category)),
];
const weights: IconWeight[] = [
  "thin",
  "light",
  "regular",
  "bold",
  "fill",
  "duotone",
];
const weightLabels = {
  thin: "纤细",
  light: "轻盈",
  regular: "标准",
  bold: "加重",
  fill: "色块",
  duotone: "双色",
};
type Entry = (typeof iconCatalog)[number];

function ColorControl({
  label,
  color,
  onChange,
}: {
  label: string;
  color: string;
  onChange: (value: string) => void;
}) {
  const [draft, setDraft] = useState(color);
  useEffect(() => setDraft(color), [color]);
  return (
    <div className="color-control">
      <span>{label}</span>
      <input
        type="color"
        aria-label={`${label}颜色`}
        value={color}
        onInput={(e) => onChange(e.currentTarget.value)}
      />
      <input
        className="hex-color"
        aria-label={`${label}色值`}
        value={draft}
        maxLength={7}
        spellCheck={false}
        onChange={(e) => {
          setDraft(e.target.value);
          if (/^#[0-9a-f]{6}$/i.test(e.target.value)) onChange(e.target.value);
        }}
        onBlur={() => setDraft(color)}
      />
    </div>
  );
}

export function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [weight, setWeight] = useState<IconWeight>("regular");
  const [size, setSize] = useState(40);
  const [theme, setTheme] = useState<IconTheme>("light");
  const [preset, setPreset] = useState<IconPreset>("lavender");
  const [custom, setCustom] = useState<IconPalette>({});
  const [entrance, setEntrance] = useState<IconEntrance>("pop");
  const [hoverAnimation, setHover] = useState<IconHover>("morph");
  const [hoverEasing, setHoverEasing] = useState<IconEasing>("spring");
  const [hoverDuration, setHoverDuration] = useState(900);
  const [hoverStagger, setHoverStagger] = useState(65);
  const [hoverReplayKey, setHoverReplayKey] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const [page, setPage] = useState(0);
  const palette = { ...palettePresets[preset][theme], ...custom };
  const [mirrored, setMirrored] = useState(false);
  const [selected, setSelected] = useState<Entry>(iconCatalog[0]);
  const [notice, setNotice] = useState("");
  const [showCode, setShowCode] = useState(false);
  const selectedSVG = useRef<SVGSVGElement>(null);
  const input = query.trim().toLocaleLowerCase();
  const filtered = iconCatalog.filter(
    (icon) =>
      (category === "全部" || icon.category === category) &&
      [
        icon.name,
        icon.component,
        `${icon.component}Icon`,
        icon.label,
        ...icon.tags,
      ].some((term) => term.toLocaleLowerCase().includes(input)),
  );
  const pageCount = Math.ceil(filtered.length / 48);
  const visible = filtered.slice(page * 48, (page + 1) * 48);
  const code = `import { ${selected.component}Icon } from "@colorful-icons/react";\nimport "@colorful-icons/react/motion.css";\n\n<${selected.component}Icon\n  size={${size}}\n  weight="${weight}"\n  theme="${theme}"\n  preset="${preset}"${Object.keys(custom).length ? `\n  palette={${JSON.stringify(palette)}}` : ""}\n  entrance="${entrance}"\n  hoverAnimation="${hoverAnimation}"\n  hoverEasing="${hoverEasing}"\n  hoverDuration={${hoverDuration}}\n  hoverStagger={${hoverStagger}}${mirrored ? "\n  mirrored" : ""}\n/>`;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setNotice("已复制 JSX，可粘贴到 React 项目中。");
    } catch {
      setShowCode(true);
      setNotice("浏览器暂不允许访问剪贴板，请从代码框手动复制。");
    }
  }
  function exportSVG() {
    if (!selectedSVG.current) return;
    downloadSVG(
      standaloneSVG(selectedSVG.current, theme, palette),
      `${selected.name}-${weight}-${theme}.svg`,
    );
    setNotice(
      `已请求下载 ${selected.name} SVG；若浏览器未保存，可使用「复制 SVG」。`,
    );
  }
  async function copySVG() {
    if (!selectedSVG.current) return;
    try {
      await navigator.clipboard.writeText(
        standaloneSVG(selectedSVG.current, theme, palette),
      );
      setNotice("已复制独立 SVG，保存为 .svg 文件即可使用。");
    } catch {
      setNotice(
        "浏览器暂不允许访问剪贴板，请使用下载 SVG，或在普通浏览器中打开本页。",
      );
    }
  }
  function choose(icon: Entry) {
    setSelected(icon);
    setNotice("");
  }

  return (
    <IconContext.Provider
      value={{
        theme,
        preset,
        palette,
        entrance,
        hoverAnimation,
        hoverEasing,
        hoverDuration,
        hoverStagger,
        animationKey,
        mirrored,
      }}
    >
      <div className="app" data-theme={theme} data-colorful-theme={theme}>
        <header className="header">
          <a className="brand" href="#" aria-label="Colorful 首页">
            <SparkleIcon size={31} />
            <span>
              colorful<span className="brand-dot">.</span>
            </span>
          </a>
          <nav aria-label="主导航">
            <a className="nav-active" href="#collection">
              图标集
            </a>
            <a href="#usage">使用指南</a>
            <a href="/design-review.html?scope=symbols">新增 466 枚符号 ↗</a>
            <a
              href="https://github.com/phosphor-icons/react"
              target="_blank"
              rel="noreferrer"
            >
              Phosphor 架构 ↗
            </a>
          </nav>
          <span className="version">
            <span /> v0.6.0
          </span>
        </header>

        <main>
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-copy">
              <span className="eyebrow">SOFT SHAPES. LITTLE STORIES.</span>
              <h1 id="hero-title">
                小图标，
                <br />
                一点
                <span className="imagination">
                  想象力
                  <svg viewBox="0 0 240 14" aria-hidden="true">
                    <path d="M3 9Q110-2 237 6M40 13Q140 5 214 10" />
                  </svg>
                </span>
                。
              </h1>
              <p>
                圆润的色块，轻轻的细线。
                <br />
                让每一个功能，都有自己的小故事。
              </p>
              <div className="hero-meta">
                <span>{iconCatalog.length} 枚插画图标</span>
                <i />
                <span>6 套配色</span>
                <i />
                <span>轻动效 SVG</span>
              </div>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="art-grid" />
              <div className="art-caption">
                a little collection of possibilities
              </div>
              <div className="floating art-book">
                <StoryIcon size={106} />
              </div>
              <div className="floating art-scene">
                <SceneIcon size={81} />
              </div>
              <div className="floating art-drop">
                <WatercolorIcon size={75} />
              </div>
              <div className="floating art-flower">
                <FlowerIcon size={61} />
              </div>
              <div className="floating art-planet">
                <PlanetIcon size={62} />
              </div>
              <SparkleIcon className="art-sparkle" size={29} />
              <span className="art-note">made to feel a little softer</span>
            </div>
          </section>

          <section
            className="collection"
            id="collection"
            aria-labelledby="collection-title"
          >
            <div className="section-top">
              <div>
                <span className="eyebrow">THE COLLECTION</span>
                <h2 id="collection-title">
                  挑一个，开始创造
                  <span className="count">{iconCatalog.length}</span>
                </h2>
              </div>
              <span className="hint">点击图标，查看细节与导出</span>
            </div>
            <div className="browser">
              <aside className="controls" aria-label="图标设置">
                <label className="control-label" htmlFor="weight">
                  图标风格<span>WEIGHT</span>
                </label>
                <div
                  className="weights"
                  id="weight"
                  role="group"
                  aria-label="图标风格"
                >
                  {weights.map((item) => (
                    <button
                      key={item}
                      className={weight === item ? "weight active" : "weight"}
                      aria-pressed={weight === item}
                      onClick={() => setWeight(item)}
                    >
                      <StoryIcon size={25} weight={item} theme={theme} />
                      <span>
                        {weightLabels[item]}
                        <small>{item}</small>
                      </span>
                    </button>
                  ))}
                </div>
                <div className="control-divider" />
                <label className="control-label" htmlFor="size">
                  预览尺寸
                  <output>
                    {size}
                    <span> px</span>
                  </output>
                </label>
                <input
                  id="size"
                  type="range"
                  min="20"
                  max="64"
                  step="2"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                />
                <div className="range-labels">
                  <span>20 px</span>
                  <button onClick={() => setSize(26)}>实际尺寸 26 px</button>
                  <span>64 px</span>
                </div>
                <div className="control-divider" />
                <span className="control-label">
                  预览背景<span>THEME</span>
                </span>
                <div
                  className="theme-switch"
                  role="group"
                  aria-label="预览背景"
                >
                  <button
                    aria-pressed={theme === "light"}
                    onClick={() => {
                      setTheme("light");
                      setCustom({});
                    }}
                  >
                    <span className="theme-dot light" />
                    浅色
                  </button>
                  <button
                    aria-pressed={theme === "dark"}
                    onClick={() => {
                      setTheme("dark");
                      setCustom({});
                    }}
                  >
                    <span className="theme-dot dark" />
                    深色
                  </button>
                </div>
                <label className="mirror">
                  <span>水平镜像</span>
                  <input
                    type="checkbox"
                    checked={mirrored}
                    onChange={(e) => setMirrored(e.target.checked)}
                  />
                  <span className="switch" aria-hidden="true" />
                </label>
                <div className="control-divider" />
                <span className="control-label">
                  三色主题<span>PALETTE</span>
                </span>
                <div className="preset-grid" role="group" aria-label="配色方案">
                  {(Object.keys(palettePresets) as IconPreset[]).map((name) => (
                    <button
                      key={name}
                      aria-pressed={
                        preset === name && !Object.keys(custom).length
                      }
                      onClick={() => {
                        setPreset(name);
                        setCustom({});
                      }}
                    >
                      <span className="preset-colors">
                        {Object.values(palettePresets[name][theme]).map(
                          (color) => (
                            <i key={color} style={{ background: color }} />
                          ),
                        )}
                      </span>
                      {palettePresets[name].label}
                    </button>
                  ))}
                </div>
                <div className="custom-colors">
                  {(["surface", "back", "detail"] as const).map((key, i) => (
                    <ColorControl
                      key={key}
                      label={["浅色块", "主色块", "细节线"][i]}
                      color={palette[key]}
                      onChange={(value) =>
                        setCustom((current) => ({ ...current, [key]: value }))
                      }
                    />
                  ))}
                </div>
                <button className="reset-colors" onClick={() => setCustom({})}>
                  恢复主题配色
                </button>
                <div className="control-divider" />
                <label className="control-label" htmlFor="entrance">
                  初始动画<span>ENTER</span>
                </label>
                <select
                  id="entrance"
                  value={entrance}
                  onChange={(e) => {
                    setEntrance(e.target.value as IconEntrance);
                    setAnimationKey((k) => k + 1);
                  }}
                >
                  <option value="pop">轻轻展开</option>
                  <option value="rise">向上浮现</option>
                  <option value="fade">柔和淡入</option>
                  <option value="none">关闭</option>
                </select>
                <label className="control-label motion-label" htmlFor="hover">
                  悬停动画<span>HOVER</span>
                </label>
                <select
                  id="hover"
                  value={hoverAnimation}
                  onChange={(e) => setHover(e.target.value as IconHover)}
                >
                  <option value="morph">软糖回弹</option>
                  <option value="lift">轻跃登场</option>
                  <option value="wiggle">俏皮摇摆</option>
                  <option value="pulse">气泡鼓起</option>
                  <option value="spread">纸片绽放</option>
                  <option value="none">关闭</option>
                </select>
                <label
                  className="control-label motion-label"
                  htmlFor="hover-easing"
                >
                  悬停缓动<span>EASING</span>
                </label>
                <select
                  id="hover-easing"
                  value={hoverEasing}
                  onChange={(e) => setHoverEasing(e.target.value as IconEasing)}
                >
                  <option value="smooth">柔和</option>
                  <option value="gentle">舒缓</option>
                  <option value="snappy">利落</option>
                  <option value="spring">弹性回弹</option>
                  <option value="linear">匀速</option>
                </select>
                <label
                  className="control-label motion-label"
                  htmlFor="hover-duration"
                >
                  悬停时长 <span>{hoverDuration} ms</span>
                </label>
                <input
                  id="hover-duration"
                  type="range"
                  min="200"
                  max="1200"
                  step="50"
                  value={hoverDuration}
                  onChange={(e) => setHoverDuration(Number(e.target.value))}
                />
                <label
                  className="control-label motion-label"
                  htmlFor="hover-stagger"
                >
                  层间延迟 <span>{hoverStagger} ms</span>
                </label>
                <input
                  id="hover-stagger"
                  type="range"
                  min="0"
                  max="150"
                  step="5"
                  value={hoverStagger}
                  onChange={(e) => setHoverStagger(Number(e.target.value))}
                />
                <button
                  className="replay"
                  onClick={() => setAnimationKey((k) => k + 1)}
                >
                  ↻ 重播初始动画
                </button>
                <p className="motion-note">
                  悬停查看各层运动 · 移开平滑归位 · 支持减少动态效果
                </p>
              </aside>

              <div className="results">
                <section className="motion-stage" aria-label="软糖动效试验台">
                  <div className="motion-stage-copy">
                    <span className="motion-stage-eyebrow">
                      A LITTLE BOUNCE.
                    </span>
                    <h3>先蓄力，再弹开。</h3>
                    <p>色块有弹性，细节慢半拍。</p>
                    <button
                      className="motion-stage-replay"
                      onClick={() => setHoverReplayKey((key) => key + 1)}
                    >
                      ↻ 播放这组动效
                    </button>
                  </div>
                  <div className="motion-stage-samples">
                    {[
                      { Icon: StoryIcon, label: "翻动纸页" },
                      { Icon: WatercolorIcon, label: "软糖水滴" },
                      { Icon: FlowerIcon, label: "花瓣舒展" },
                    ].map(({ Icon, label }) => (
                      <button
                        key={label}
                        data-colorful-hover-target=""
                        className="motion-sample"
                        aria-label={`${label}动效`}
                        onClick={() => setHoverReplayKey((key) => key + 1)}
                      >
                        <Icon
                          size={64}
                          weight={weight}
                          hoverReplayKey={hoverReplayKey}
                          entrance="none"
                        />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="motion-stage-beats" aria-label="动效节奏">
                    <span>01 蓄力</span>
                    <span>02 释放</span>
                    <span>03 回摆</span>
                    <span>04 落定</span>
                  </div>
                </section>
                <div className="search-row">
                  <label className="search">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="10.5" cy="10.5" r="6.5" />
                      <path d="m16 16 4 4" />
                    </svg>
                    <input
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(0);
                      }}
                      placeholder="搜索图标、名称或关键词…"
                      aria-label="搜索图标"
                    />
                    {query ? (
                      <button
                        onClick={() => {
                          setQuery("");
                          setPage(0);
                        }}
                        aria-label="清空搜索"
                      >
                        ×
                      </button>
                    ) : (
                      <span className="search-tip">中 / EN</span>
                    )}
                  </label>
                </div>
                <div className="filter-row">
                  <div
                    className="categories"
                    role="group"
                    aria-label="图标分类"
                  >
                    {categories.map((item) => (
                      <button
                        key={item}
                        aria-pressed={category === item}
                        onClick={() => {
                          setCategory(item);
                          setPage(0);
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  <span className="results-count" aria-live="polite">
                    {filtered.length} 枚图标
                  </span>
                </div>
                <IconContext.Provider
                  value={{
                    size,
                    weight,
                    mirrored,
                    theme,
                    preset,
                    palette,
                    entrance,
                    hoverAnimation,
                    hoverEasing,
                    hoverDuration,
                    hoverStagger,
                    animationKey,
                  }}
                >
                  <div className="icon-grid">
                    {visible.map((entry, index) => (
                      <button
                        key={entry.name}
                        data-colorful-hover-target=""
                        className={`icon-card ${selected.name === entry.name ? "selected" : ""}`}
                        aria-label={`${entry.label} ${entry.component}Icon`}
                        aria-pressed={selected.name === entry.name}
                        onClick={() => choose(entry)}
                      >
                        <div className="icon-art">
                          <CatalogIcon
                            name={entry.component}
                            animationDelay={Math.min(index * 12, 240)}
                          />
                        </div>
                        <span>{entry.label}</span>
                        <small>{entry.component}</small>
                        {selected.name === entry.name ? (
                          <span className="selected-mark" aria-hidden="true">
                            ✓
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </IconContext.Provider>
                {pageCount > 1 ? (
                  <div className="pagination">
                    <button
                      disabled={page === 0}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      ← 上一页
                    </button>
                    <span>
                      第 {page + 1} / {pageCount} 页
                    </span>
                    <button
                      disabled={page + 1 >= pageCount}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      下一页 →
                    </button>
                  </div>
                ) : null}
                {filtered.length === 0 ? (
                  <div className="empty">
                    <FolderIcon size={56} theme={theme} />
                    <h3>这里还没有这枚图标</h3>
                    <p>试试「故事」「自然」或「heart」。</p>
                    <button
                      onClick={() => {
                        setQuery("");
                        setCategory("全部");
                        setPage(0);
                      }}
                    >
                      查看全部图标
                    </button>
                  </div>
                ) : null}
                <div className="grid-footer">
                  <span>
                    <span className="tiny-dot" /> SVG 矢量 · 透明背景 · 自由缩放
                  </span>
                  <span>DESIGNED WITH A SOFT TOUCH</span>
                </div>
              </div>
            </div>

            <div className="detail" aria-label="选中图标详情">
              <div className="detail-icon" data-colorful-hover-target="">
                <CatalogIcon
                  name={selected.component}
                  ref={selectedSVG}
                  size={size}
                  weight={weight}
                  mirrored={mirrored}
                  theme={theme}
                />
              </div>
              <div className="detail-name">
                <span>
                  {selected.label}
                  <small>{selected.category}</small>
                </span>
                <code>{selected.component}Icon</code>
              </div>
              <div className="detail-sizes" aria-label="实际尺寸对比">
                {[20, 26, 40].map((s) => (
                  <div key={s}>
                    <CatalogIcon
                      name={selected.component}
                      size={s}
                      weight={weight}
                      mirrored={mirrored}
                      theme={theme}
                    />
                    <span>{s}px</span>
                  </div>
                ))}
              </div>
              <div className="detail-actions">
                <button className="secondary" onClick={exportSVG}>
                  <span aria-hidden="true">↓</span> 下载 SVG
                </button>
                <button className="primary" onClick={copyCode}>
                  <span aria-hidden="true">〈/〉</span> 复制 JSX
                </button>
                <button className="code-toggle" onClick={copySVG}>
                  复制 SVG
                </button>
                <button
                  className="code-toggle"
                  onClick={() => setShowCode(!showCode)}
                  aria-expanded={showCode}
                >
                  {showCode ? "收起代码" : "查看代码"}
                </button>
              </div>
            </div>
            <p className="notice" role="status">
              {notice}
            </p>
            {showCode ? (
              <pre className="selected-code" tabIndex={0}>
                <code>{code}</code>
              </pre>
            ) : null}
          </section>

          <section className="usage" id="usage">
            <div>
              <span className="eyebrow">READY WHEN YOU ARE</span>
              <h2>轻松放进你的下一个作品。</h2>
              <p>
                熟悉的组件 API，完整的插画层次。
                <br />
                支持按需导入、全局样式与服务端渲染。
              </p>
              <div className="usage-badges">
                <span>TypeScript</span>
                <span>Tree-shakable</span>
                <span>SSR ready</span>
              </div>
              <small className="local-note">
                当前为本地开发版：运行 npm pack 后，将生成的 .tgz 安装到项目。
              </small>
            </div>
            <div className="code-card">
              <div className="code-top">
                <span className="code-dots">● ● ●</span>
                <span>your-next-idea.tsx</span>
                <span>REACT</span>
              </div>
              <pre>
                <code>
                  <span className="code-purple">import</span>{" "}
                  {"{ StoryIcon, IconContext }"}
                  <br /> <span className="code-purple">from</span>{" "}
                  <span className="code-green">"@colorful-icons/react"</span>;
                  <br />
                  <br />
                  <span className="code-muted">
                    {'import "@colorful-icons/react/motion.css";'}
                  </span>
                  <br />
                  {"<IconContext.Provider value={{ size: 26 }}>"}
                  <br />
                  {
                    '  <StoryIcon preset="mint" entrance="pop" hoverAnimation="lift" />'
                  }
                  <br />
                  {"</IconContext.Provider>"}
                </code>
              </pre>
            </div>
          </section>
        </main>
        <footer>
          <a className="brand" href="#">
            <SparkleIcon size={23} />
            <span>colorful.</span>
          </a>
          <span>一点色彩，一点温柔，一点想象力。</span>
          <span>{iconCatalog.length} ICONS · MADE WITH CARE</span>
        </footer>
      </div>
    </IconContext.Provider>
  );
}
