# v0.3.0 全量重绘验证

2026-09-11，分支 codex/redesign-soft-icons。

## 覆盖与设计

- core 374 / nature 195 / objects 227 / people-media 257，合计1,053枚。
- 每个名称都有显式绘制路由与部件说明，见 ../catalog.json。
- 全部1,053枚regular与0.2.0快照不同；全量React输出无完全重复图形。
- 12枚校准样张纳入新库，其余按语义物件族重新绘制。
- 全组26/56px联系表逐枚目视审查，浅深色代表图复查；跨组审查修复项见同目录其他报告。
- 重点修复球类拼片、橄榄球、人物腿部、齿轮徽标、4K/SD、录制圆点、麦穗、图钉、顶部加行、钢笔与铅笔、音乐及沙漏状态。
- 文档原始3枚参考与归档版本字节一致，未以重绘覆盖参考。

## 自动验证

`npm run check` 退出码0：

- assemble:check：1,053 × 6，同步CSR、SSR及SVG。
- 两个TypeScript项目检查通过。
- Vitest：5文件、21项全部通过。
- ESM/CJS/d.ts/UMD构建成功。
- 真实安装包：14个ESM/CJS入口、6个server条件入口、Bundler与NodeNext的ESM/CJS类型、UMD、client边界和tree shaking通过。
- 单Story按需产物6,500字节（React external）。
- 主预览和全量对照两个HTML入口构建成功。

`npm run test:geometry` 退出码0：4组全部通过SVG/XML、三色、有限坐标和描边边界检查。

## 浏览器

- 主预览v0.3.0实际渲染新图形，无console error。
- 全量对照支持1,053枚、36枚/页、搜索、分类和26/56/72px、浅深色。
- 浏览器确认薄荷色值 #e5f2e9 / #afd5c2 / #548b76、rise/wiggle选择状态。
- 镜像独立g的scaleX(-1)，计算样式transition-duration为0.32s。
- 悬停lift实际矩阵为 matrix(1.02749,-0.0718492,0.0718492,1.02749,0,-0.8)。
- 默认配色及动画在验证后恢复。

安装包：colorful-icon-react-0.3.0.tgz，1,332,428字节，19,000文件。仅本地生成，未发布。

工程检查验证可用性；设计质量记录来自目视检查，仍可针对具体图标继续精修。六种样式延续规则派生，不声称每种都是独立重画的原始图稿。
