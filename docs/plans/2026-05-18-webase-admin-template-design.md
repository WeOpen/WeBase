# WeBase 后台管理系统前端模板 PRD 与技术设计

## 1. 项目背景

WeBase 的定位是一个后台管理系统前端脚手架模板。本次建设以 `thesvg/` 目录项目作为视觉与交互参考，但不修改 `thesvg/` 本身。WeBase 将在根目录独立创建前端工程，复刻 `thesvg` 的视觉语言，并把业务语义替换为后台管理系统常用能力。

核心目标是：样式、布局、交互气质参考 `thesvg` 做到高度一致；功能改为登录、仪表盘、用户管理、角色权限、菜单管理、系统设置、数据表格 CRUD；数据层预留 API 适配，首版使用 mock adapter。

## 2. 产品目标

### 2.1 核心目标

- 在 WeBase 根目录创建独立后台管理系统前端模板。
- `thesvg/` 仅作为参考项目，不做任何代码或文档修改。
- 复刻 `thesvg` 的悬浮玻璃顶栏、深浅色主题、圆角卡片、细边框、柔和阴影、响应式侧栏与动效节奏。
- 覆盖标准后台首版功能：登录、仪表盘、用户管理、角色权限、菜单管理、系统设置、CRUD 表格。
- 建立可替换的 API 服务层，首版 mock 数据运行，后续可接入真实后端。

### 2.2 成功标准

- `/login` 可通过 mock 登录进入 `/dashboard`。
- `/dashboard` 展示后台指标、快捷入口、最近活动和系统状态。
- `/system/users` 支持搜索、状态筛选、分页、新增、编辑、启用/禁用、删除。
- `/system/roles` 支持角色列表、角色表单和菜单级权限树 mock。
- `/system/menus` 支持树形菜单维护。
- `/system/settings` 支持基础系统配置展示与 mock 保存。
- 全局布局支持顶部 header、左侧 sidebar、移动端 drawer、深浅色切换、全局搜索入口。
- 页面视觉与 `thesvg` 在间距、圆角、边框、阴影、暗色模式和卡片布局上保持高度一致。
- lint、build 和核心浏览器路径验证通过。

## 3. 用户与使用场景

### 3.1 目标用户

- 需要快速启动后台管理系统项目的前端开发者。
- 需要可维护、可二次开发模板的团队。
- 需要统一 UI 风格和基础管理能力的产品原型团队。

### 3.2 典型场景

- 作为新后台系统的初始工程模板。
- 作为用户、角色、菜单、设置等标准模块的参考实现。
- 作为接入真实后端前的前端交互原型。

## 4. 首版功能范围

### 4.1 登录页 `/login`

- 用户名、密码、记住我。
- mock 登录校验。
- 登录成功后写入 token 和当前用户信息。
- 登录成功跳转 `/dashboard`。
- 使用 `thesvg` 风格的深色背景、渐变光斑、玻璃质感卡片和大圆角。

### 4.2 仪表盘 `/dashboard`

- 欢迎区。
- 今日访问量、活跃用户、待处理事项、系统健康状态。
- 快捷入口。
- 最近登录与最近操作。
- 轻量趋势占位图。
- 首版不引入复杂图表库，使用 Tailwind 和 mock 数据展示趋势块。

### 4.3 用户管理 `/system/users`

- 用户列表：用户名、邮箱、角色、状态、创建时间、操作。
- 搜索、状态筛选、分页。
- 新增、编辑、启用/禁用、删除确认。
- 表单基础校验。

### 4.4 角色权限 `/system/roles`

- 角色列表：角色名、标识、用户数、状态、描述。
- 新增、编辑、删除。
- 菜单级权限树 mock。
- 首版不实现按钮级权限和数据级权限。

### 4.5 菜单管理 `/system/menus`

- 树形菜单列表：菜单名称、路径、图标、排序、状态。
- 新增、编辑、删除。
- 菜单数据用于侧栏导航 mock 展示。
- 不实现复杂动态路由生成。

### 4.6 系统设置 `/system/settings`

- 基础配置：系统名称、Logo 文案、主题默认值。
- 安全配置：登录过期时间、密码策略展示。
- 通知配置：邮件/站内通知开关 mock。
- mock 保存反馈。

### 4.7 通用 CRUD 能力

用户管理作为首个完整 CRUD 示例，覆盖搜索、筛选、分页、新增/编辑弹窗、删除确认、空状态、加载状态。

## 5. 明确不做事项

首版不做：

- 修改 `thesvg/` 目录内任何文件。
- 真实后端接口联调。
- 复杂按钮级权限。
- 数据级权限。
- 多租户。
- 审计中心。
- 消息通知中心。
- 文件管理。
- 复杂图表库集成。
- 国际化。
- 单元测试全覆盖。

## 6. 技术架构设计

### 6.1 技术栈

WeBase 根目录新建独立前端工程，采用：

- Next.js App Router。
- React。
- TypeScript。
- Tailwind CSS。
- shadcn 风格基础组件。
- next-themes。
- Zustand。
- lucide-react。

### 6.2 目录结构

```text
WeBase/
  docs/
    plans/
  public/
  src/
    app/
      login/
      dashboard/
      system/
        users/
        roles/
        menus/
        settings/
    components/
      layout/
      dashboard/
      system/
      data-table/
      ui/
    lib/
      api/
      services/
      auth/
      navigation/
      permissions/
      stores/
  package.json
  next.config.ts
  tsconfig.json
```

### 6.3 组件分层

- `layout`：全局布局，不耦合用户、角色等业务。
- `dashboard`：仪表盘页面组件。
- `system`：用户、角色、菜单、设置业务表单和局部组件。
- `data-table`：必要的表格、工具栏和分页能力，不过度泛型化。
- `ui`：基础组件，保持 shadcn 风格。

### 6.4 数据流

```text
Page
  -> service function
    -> api client
      -> mock adapter
```

页面不直接读取 mock 数据；后续接入真实 API 时替换 client 或 adapter 即可。

### 6.5 API 类型

```ts
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

### 6.6 状态管理

- `auth-store`：token、当前用户、登录/退出状态。
- `layout-store`：侧栏展开、移动端菜单。
- 表格数据、表单状态、筛选条件优先放页面内。

## 7. 视觉设计策略

WeBase 复刻 `thesvg` 的视觉语言，但不复制其图标业务：

- 整体背景沿用低对比、柔和边框、深色优先的质感。
- 顶部导航采用 sticky 悬浮玻璃 header、圆角容器、模糊背景、细阴影。
- 侧边栏采用桌面侧栏和移动端抽屉体验。
- 卡片系统使用大圆角、细边框、暗色半透明、hover 反馈。
- Dashboard welcome panel 参考 `HomeHero` 的节奏。
- 搜索体验从图标搜索改为全局菜单、用户、角色搜索，并保留 `Cmd/Ctrl + K`。
- 动效保留淡入、hover scale、轻量 progress/float 效果，不新增复杂动画库。

## 8. Roadmap

### Phase 1：PRD 与设计落地

- 输出 PRD 文档。
- 输出技术设计文档。
- 输出 Roadmap。
- 明确首版范围和不做事项。

### Phase 2：根目录工程初始化

- 在 WeBase 根目录创建 Next.js 前端工程配置。
- 建立 Tailwind、TypeScript、基础布局和主题能力。
- 保持 `thesvg/` 只读参考。

### Phase 3：基础架构建设

- 建立 AppShell、Header、Sidebar。
- 建立 mock API 与 services。
- 建立 auth/layout store。

### Phase 4：核心页面实现

- 登录页。
- 仪表盘。
- 用户管理。
- 角色权限。
- 菜单管理。
- 系统设置。

### Phase 5：交互与视觉精修

- 表格搜索、筛选、分页。
- 表单弹窗、确认删除。
- 全局搜索。
- 深浅色适配。
- 响应式适配。

### Phase 6：验证与交付

- 运行 lint/build。
- 启动 dev server。
- 浏览器验证核心路径。
- 修复视觉与交互问题。
- 输出最终总结。

## 9. 原则应用

- KISS：首版只实现后台模板必要能力，不引入复杂图表、权限引擎或数据请求框架。
- YAGNI：不做真实后端、多租户、审计中心、消息中心、文件管理等非首版目标。
- DRY：表格、分页、弹窗、API 响应类型集中复用，避免各页面重复实现基础交互。
- SOLID：布局、业务组件、服务层、mock adapter 各自承担单一职责，API 适配点对后续真实接口替换开放。
