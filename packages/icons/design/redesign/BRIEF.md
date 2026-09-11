# 全量造型重绘约束

用户已经认可方向并明确要求「开始全部重新设计」。目标是当前 catalog 的每枚图标使用新造型（共 1,053 枚），不是再次做颜色/波浪分区转换。

必读 `docs/SKILL.md`、`docs/design/visual-language-review.md`，以及 `design/studies/01-soft-objects/*.svg` 的代表样张。样张是已选择方向，正式资产可直接采用相应样张。

- 原生 SVG 24×24，默认26px；3个语义 token surface #f0e9f8 / back #d9c9ed / detail #aa8bcf。根模板 stroke 1.1，round cap/join。
- 用物件真实部件组织色块。圆润、轻微不对称，饱满主体，避免通用底板、随机切面、密集外描边。细线一般1–3组，少量有含义的点/局部可用深色填色。
- 不允许读取旧 regular 或 vendor artwork 来变换/裁切/自动圆角得到新图形。可读文件内容理解语义，但新路径必须自主设计。禁止 hash/随机数驱动造型。
- 可以共用精心设计的物件族母版和明确状态部件，例如文件折页、相机镜头、聊天气泡。每个变体必须忠于名字中的语义（camera-plus 有 plus，file-audio 有音符等）。禁止对未处理名字使用泛用图形兜底；必须显式列举每个name的路由或在未处理时抛错。
- 同系列的变体可以复用身体/部件，但不同物件绝不能只有颜色/微小随机线条差异。纯状态图形原本语义确实需要圆框的可以用（例如 play-circle）；不为其他图标额外加框。
- 封闭填色显式stroke=none；填色须为3token之一；线条fill=none继承根stroke。不要嵌入文字、font、raster、SVG ids、filter。文件型后缀原语义为格式时可以使用区别明显的图形元素，优先不用文本，不接受所有文件同一图案。
- 仅编辑分配清单内的 `assets/regular/<name>.svg`。如果要写绘图脚本，只写 `design/redesign/<group>.mjs` 与同组私有模块。不碰公共src、catalog、package、tests，也不运行 assemble/build（由主agent集成）。不要 git commit，不要改动其他人的文件，不要生成新task/子agent。
- 记录每个name的family、visualReason到 `design/redesign/notes/<group>.json`，必须覆盖整个分配清单，不以复制旧图补漏。
- 检查SVG XML、path边界（包含.55描边裕量）、不包含NaN/Infinity、颜色最多三种。整体需在26px可读。主agent将渲染对照和统一复查。
- 汇报实际已处理数、复用样张数、关键绘制族、运行过的检查、仍需注意的图形。未完成必须如实报告，不可以直接宣称全部完成。

建议用单个const形状字典（手绘path字符串）、小型填色/描线帮助函数和显式variant映射输出文件，SVG资产是可编辑交付物。少量同族旋转/镜像/状态覆盖是合理设计复用；几何自动套色不是。

## 2026-09-11 圆润修订
用户明确要求所有元素圆角。在上述自主绘制的轮廓上增加确定性的切线圆角处理，不重新读取上游形状，不改分色或语义。npm run redesign 最后执行 scripts/round-icons.mjs；轮廓存在零宽折返时，先在物件族源中修正。圆角处理后的 regular 是派生组件及导出的共同来源。
