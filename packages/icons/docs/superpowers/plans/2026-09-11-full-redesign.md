# 全量柔和物件图标重绘 Implementation Plan

**Goal:** 依照用户接受的12枚样张，重新设计当前1,053枚图标的主体、部件分色、细节与视觉重量，沿用动画和React接口。
**Architecture:** 手工定义有语义的物件族及状态变体，输出可编辑 regular SVG，再沿用既有 assemble/CSR/SSR/weight 流程。每个名字有明确分配与设计说明，没有fallback。
**Spec:** docs/design/visual-language-review.md；design/redesign/BRIEF.md。

## Global Constraints
- 保留 docs 原始输入与旧稿快照，逐项记录重绘完成度。
- 24单位、三色语义、1.1细线、无无意义底板，无随机切面。
- 4个图标组写入互不重叠文件；主任务负责集成、样张对照、视觉检查和工程验证。
- 用户已要求执行，在同一会话持续完成，无需再次确认方案。

## Tasks
- [x] 1. 自然/天气/游戏/健康组，按 assignments/nature.json 重绘并自查。
- [x] 2. 旅行/商业/生活组，按 assignments/objects.json 重绘并自查。
- [x] 3. 媒体/人物/物件组，按 assignments/people-media.json 重绘并自查。
- [x] 4. 主任务完成创作/常用/沟通/系统/办公/设计/科技组。
- [x] 5. 全量清点；检查所有名字有设计记录、新旧资产是否相同、重复图形、三色/边界/语义变体，修复问题。
- [x] 6. 生成全量组件，更新预览重绘标记与全量对照页、文档及转换脚本安全边界。
- [x] 7. 浏览器查看每个族的对照和26px效果；运行assemble:check、类型、单元、构建、打包消费、预览构建，产出新安装包。

## Isolation / execution
全部新旧资产已在当前工作区保存快照，切换到 codex/redesign-soft-icons 分支；不迁移正在使用的本地预览目录，不提交未跟踪的用户文档。并行任务只改自身分组SVG和私有绘制模块，由主任务审阅整合。
