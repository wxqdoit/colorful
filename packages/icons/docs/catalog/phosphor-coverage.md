# Phosphor 全目录重绘记录

v0.6.0 覆盖本地锁定的 Phosphor 全部 **1,512** 个名称，排除 **0** 枚。加上 7 枚项目专属图标，Colorful 共 **1,519** 枚，提供 **9,114** 个六种样式 SVG。

本轮补绘此前排除的 466 枚：方向与布局 141、文字与运算 141、品牌标识 79、功能符号 105。依据语义选择圆润线条、局部填色、开放留白；圆形或方形容器仅用于本来就有容器含义的符号。品牌保留识别轮廓并统一主题配色。绘制源不读取上游 SVG 路径。

- 当前逐项状态：[phosphor-coverage.json](phosphor-coverage.json)。
- 初版选择与排除依据：[历史记录](phosphor-coverage-0.2.0.md)；这些排除决定在 v0.6.0 已取消。
- 逐项设计说明：[设计目录](../../design/redesign/catalog.json)。
- 原版与新设计对照：本地 `/design-review.html?scope=symbols`。

上游来源：[Phosphor React](https://github.com/phosphor-icons/react)，React revision `81ac06f9bf4b4dedf9b8fead0a1ebd47c41d67ef`，core revision `b7deeb195790ae085c7fc58e5bc7f163ff3ca088`。
