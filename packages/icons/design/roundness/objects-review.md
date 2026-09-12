# Objects 圆角视觉审查

审查对象：`design/redesign/assignments/objects.json` 中全部 **227 枚**，读取当前 `assets/regular`。只读检查资产，未修改生成器或资产。

## 实际查看范围

- 已逐张查看四张联系表，每枚同时渲染约 56px 和 26px：`/tmp/objects-0.png`、`/tmp/objects-1.png`、`/tmp/objects-2.png`、`/tmp/objects-3.png`（70 + 70 + 70 + 17）。
- 对以下 **20 枚**另外查看约 180px 的圆角前后对照，基线为 `design/archive/0.3.0-regular`：navigation-arrow、needle、paper-plane、paper-plane-right、paper-plane-tilt、flag-pennant、sailboat、castle-turret、building-office、blueprint、cash-register、tea-bag、synagogue、fork-knife、pants、shirt-folded、high-heel、graduation-cap、airplane、bank。
- 对照表：`/tmp/objects-detail-0.png`、`/tmp/objects-detail-1.png`。

## 发现

**没有发现这次填充路径圆角新增的明显缺口、部件脱离或语义损坏。** 纸飞机折面、城堡垛口、衬衫领子、楼体、鞋跟等高风险局部在对照中保持完整。帆与船体、学位帽上下面等原有间隙保留，未把原设计间隙记成缺陷。

仍存在一个“所有元素圆角”覆盖口径问题：部分描边路径的转折只依靠 `stroke-linejoin="round"`，外缘圆化，但内侧仍呈方角或尖角。这是基线已有、当前未处理的问题，不是本次圆角新增破坏。

| 图标 | 具体局部 | 当前路径证据 / 视觉表现 |
| --- | --- | --- |
| blueprint | 内部房间框及隔断转折 | `M8 7h9v9H8Zm0 4h5V7m0 4v3`；框的内侧仍呈直角，放大对照前后相同。 |
| cash-register | 上方显示屏内框 | 显示屏外缘有描边圆角，内部白色窗口仍是硬直角矩形；56px 可见。 |
| tea-bag | 顶部提绳右上转折 | 绳子外缘圆，但右上内侧仍是硬直角；放大对照前后相同。 |
| needle | 针眼内部 | `M18 4l2 1-3 3Z`；三角针眼的内孔仍尖，尽管外侧描边圆接。 |

`roundSVG` 跳过 `fill="none"` 路径，所以以上结果符合当前算法。若验收要求包括描边内缘也形成可见弧线，应继续把描边中心路径拐点改为曲线；若要求仅为 SVG 标准 round join，则这些已经满足该较窄口径。

## 结论

227/227 已完成两个常用尺寸的视觉审查，20/227 额外完成基线放大对照。填充面圆化通过；没有观察到新增的可见结构回归。剩余事项是上述描边内侧硬角的验收口径与覆盖范围。

## 第二轮：描边中心路径圆角复查

在根任务把描边中心路径拐角也圆化后，再从基线 `inspectRoundness(...).issues` 中筛出 `kind=stroke-corner` 的 **43 枚**，全部重新查看 26px/56px 联系表 `/tmp/objects-stroke-0.png`。重新生成并查看两张 180px 基线对照表，包含原四个问题局部。

**原先四项已修复**：blueprint 房间框、cash-register 显示屏、tea-bag 提绳和 needle 针眼现在可见实际弧线，不再只是外缘 round join；未观察到开口或连接丢失。该 43 枚当前 `inspectRoundness` 全部无问题。

**新增 1 项需修复的语义回归：synagogue 的大卫之星。** 当前统一 .8 的描边圆角将两个三角形的六个尖端削成大幅圆弧，外围六个小三角负形基本消失。56px 看起来接近圆形花结，180px 前后对照可确认六角星结构明显弱化（`/tmp/objects-detail-1.png` 第二行左）。建议仅对该星形采用更小但非零圆角（例如 .2～.3），或适当放大星形来保留六个尖端/空隙；无需撤回其他元素圆角。

其余 **42 枚**未观察到新增的箭头方向、细线、货币符号或结构语义损失。原先填充面检查结论仍有效。本次为只读复查，未修改资产。

## 第三轮：synagogue 修复确认

再次只读渲染并查看该图标的 **26px、56px、192px**，预览为 `/tmp/objects-synagogue-final.png`。扩大星形、采用 .85 描线和 .5 局部圆角后，两组三角形与六个外围三角空隙恢复可读；56px 能明确识别六角星，26px 下仍保留该结构，192px 可确认端部与内侧弧线圆润。未发现新缺口或部件损失。

**synagogue 语义回归已修复。objects 组本次提出的全部问题均已关闭。**
