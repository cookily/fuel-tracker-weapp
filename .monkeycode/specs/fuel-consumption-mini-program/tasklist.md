# 需求实施计划

- [ ] 1. 搭建微信原生小程序项目骨架并配置页面路由
  - 创建 `app.js`、`app.json`、`app.wxss` 与页面目录，覆盖设计中的 App Shell 和 4 个核心页面，对应 Requirement 1、Requirement 2、Requirement 4、Requirement 6。
  - 配置底部导航与页面标题，保证车辆页、记录页、统计页和编辑页可访问。

- [ ] 2. 实现核心数据模型、存储接口和全局状态
  - 在 `utils` 或 `services` 中定义 `Vehicle`、`RefuelRecord`、`AppState` 对应的数据结构，实现 `loadAppState()`、`saveAppState()`、`setCurrentVehicle()`，覆盖 Requirement 1、Requirement 6。
  - 实现本地存储读取失败时的初始化兜底逻辑，覆盖 Requirement 6.2、Requirement 6.3。
  - [ ]* 2.1 为存储加载和状态切换编写单元测试，覆盖设计 Correctness Properties 4。

- [ ] 3. 实现油耗重算和统计聚合服务
  - 编写 `recalculateVehicle(vehicle)`，按时间正序稳定处理记录，生成阶段油耗、百公里费用和待计算状态，覆盖 Requirement 3.1、Requirement 3.2、Requirement 3.3、Requirement 5.2。
  - 实现统计聚合函数，输出累计里程、累计加油量、平均油耗、累计加油金额和趋势序列，覆盖 Requirement 4.3、Requirement 4.4。
  - [ ]* 3.1 为重算逻辑编写单元测试，覆盖首条记录、连续满油记录和编辑后的重算场景。
  - [ ]* 3.2 为 Correctness Property 1 编写性质测试，验证同日记录和录入顺序下的稳定排序结果。
  - [ ]* 3.3 为 Correctness Property 2 和 3 编写性质测试，验证里程递增与正数数值约束。

- [ ] 4. 实现车辆管理页面和表单交互
  - 完成车辆列表页与车辆编辑页，支持首次引导创建、编辑和切换当前车辆，覆盖 Requirement 1.1、Requirement 1.2、Requirement 1.3、Requirement 1.4。
  - 在页面层接入全局状态与存储保存，确保车辆变更后立即刷新界面和后续计算。

- [ ] 5. 实现加油记录列表、编辑和重算流程
  - 完成记录列表页和记录编辑页，支持新增、修改、删除确认和时间倒序展示，覆盖 Requirement 2、Requirement 5、Requirement 4.1、Requirement 4.2。
  - 在表单中实现必填校验、里程递增校验和错误提示保留，覆盖 Requirement 2.3、Requirement 2.4 与设计 Error Handling 1。
  - 在保存和删除后触发车辆重算与本地持久化，覆盖 Requirement 2.5、Requirement 5.2、Requirement 5.4、Requirement 6.1。

- [ ] 6. 实现统计页和趋势展示
  - 展示累计指标卡片、最近阶段列表和简化趋势图，覆盖 Requirement 4.3、Requirement 4.4。
  - 对可计算记录不足场景展示占位提示，保持统计页可读性，覆盖 Requirement 3.3。

- [ ] 7. 检查点 - 确保所有测试通过,如有疑问请询问用户
  - 校验页面路由、存储恢复、车辆切换、记录重算和统计展示链路可正常工作。
