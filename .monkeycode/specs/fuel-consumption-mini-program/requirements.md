# Requirements Document

## Introduction

本需求定义一个用于记录车辆加油与油耗数据的微信小程序。系统面向个人车主，支持录入每次加油记录、计算阶段油耗、展示历史趋势，并帮助用户了解单次与长期用车燃油成本。

## Glossary

- **System**: 油耗计算记录微信小程序。
- **Refuel Record**: 一次完整的加油记录，包含日期、里程、加油量、金额等信息。
- **Full Tank Record**: 用户确认本次为加满状态的加油记录。
- **Segment Fuel Consumption**: 两次可计算记录之间的平均油耗，单位为 L/100km。
- **Vehicle**: 用户维护的一辆车辆。

## Requirements

### Requirement 1

**User Story:** AS 车主, I want 创建车辆档案, so that 我可以按车辆分别记录油耗数据。

#### Acceptance Criteria

1. WHEN 用户首次进入系统, the System SHALL 引导用户创建至少一个 Vehicle。
2. WHEN 用户创建 Vehicle, the System SHALL 允许录入车辆名称、车牌备注、燃油类型和油箱容积。
3. WHILE 系统存在多个 Vehicle, the System SHALL 支持用户切换当前查看的 Vehicle。
4. WHEN 用户编辑 Vehicle, the System SHALL 保存更新后的车辆信息并立即用于后续计算。

### Requirement 2

**User Story:** AS 车主, I want 记录每次加油信息, so that 我可以持续积累油耗计算数据。

#### Acceptance Criteria

1. WHEN 用户新增 Refuel Record, the System SHALL 允许录入加油日期、当前里程、加油量和加油金额。
2. WHEN 用户提交 Refuel Record, the System SHALL 允许用户标记本次记录是否为 Full Tank Record。
3. IF 用户录入的当前里程小于该 Vehicle 最近一条记录的里程, the System SHALL 提示用户修正里程后再提交。
4. IF 用户缺少必填字段, the System SHALL 明确提示缺失项并保留已输入内容。
5. WHEN 用户成功提交 Refuel Record, the System SHALL 将记录追加到当前 Vehicle 的历史记录中。

### Requirement 3

**User Story:** AS 车主, I want 自动计算油耗与费用, so that 我可以直接看到每个阶段的用油表现。

#### Acceptance Criteria

1. WHEN 当前 Full Tank Record 与上一条可计算记录之间存在有效里程差值, the System SHALL 计算 Segment Fuel Consumption。
2. WHEN 系统完成阶段计算, the System SHALL 计算该阶段的百公里燃油费用。
3. IF 计算所需的历史记录不足, the System SHALL 将该记录标记为待计算状态。
4. WHEN 用户查看某条已完成计算的记录, the System SHALL 展示该阶段行驶里程、总加油量、平均油耗和燃油费用。

### Requirement 4

**User Story:** AS 车主, I want 查看历史记录和趋势, so that 我可以了解长期油耗变化。

#### Acceptance Criteria

1. WHEN 用户进入记录列表页, the System SHALL 按时间倒序展示当前 Vehicle 的 Refuel Record。
2. WHEN 某条 Refuel Record 已完成阶段计算, the System SHALL 在列表中展示对应的 Segment Fuel Consumption。
3. WHEN 用户进入统计页, the System SHALL 展示当前 Vehicle 的累计行驶里程、累计加油量、平均油耗和累计加油金额。
4. WHEN 统计数据达到最小展示条件, the System SHALL 以图表或趋势形式展示最近阶段油耗变化。

### Requirement 5

**User Story:** AS 车主, I want 修改和删除记录, so that 我可以修正错误数据。

#### Acceptance Criteria

1. WHEN 用户打开已有 Refuel Record, the System SHALL 支持用户修改记录内容。
2. WHEN 用户保存修改后的 Refuel Record, the System SHALL 重新计算受影响的后续统计结果。
3. WHEN 用户请求删除 Refuel Record, the System SHALL 要求用户二次确认。
4. WHEN 用户完成删除确认, the System SHALL 从当前 Vehicle 的记录集中移除该记录并刷新相关统计数据。

### Requirement 6

**User Story:** AS 车主, I want 本地保存我的数据, so that 我可以在小程序内持续使用记录能力。

#### Acceptance Criteria

1. WHEN 用户完成任意 Vehicle 或 Refuel Record 的新增、编辑或删除操作, the System SHALL 将最新数据持久化到本地存储。
2. WHEN 用户重新进入小程序, the System SHALL 从本地存储恢复最近一次保存的数据。
3. IF 本地存储读取失败, the System SHALL 提示用户数据加载异常并保留可重新初始化的入口。

## Open Questions

1. 是否需要支持微信登录与云端同步。
2. 是否需要支持导出记录为 Excel 或图片。
3. 是否只支持单车主单账号场景。
4. 油耗计算规则是否固定为满油法。
