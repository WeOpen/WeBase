# WeBase 代码规范

## 目标

本文档是 WeBase 管理后台的日常编码基准。新功能优先遵守本规范；修改旧代码时，在不改变行为的前提下同步清理附近的明显偏差。

## 命名规范

- 文件名使用 kebab-case：`user-form-dialog.tsx`、`dashboard-service.ts`。
- React 组件使用 PascalCase：`UserFormDialog`、`MetricCard`。
- Hooks 和 Zustand stores 使用 `use` 前缀：`useAuthStore`、`useLayoutStore`。
- 本地事件处理函数使用 `handle` 前缀，组件 props 使用 `on` 前缀：`handleSubmit`、`onOpenChange`。
- 布尔值使用清晰谓词：`isActive`、`hasQuery`、`submitting`、`loading`。
- API 和 service 函数使用动词加名词：`listUsers`、`updateSettings`、`getDashboardOverview`。认证类可使用领域标准动词：`login`、`logout`。
- 局部计算值使用 camelCase；模块级不可变配置、静态目录或环境级常量可使用全大写，例如 `PAGE_SIZE`、`NAV_SECTIONS`。

## 注释规范

- 优先写清晰代码，而不是用注释解释普通代码。
- 只在非显而易见的约束、浏览器行为、兼容性原因或架构决策处添加注释。
- 不在源码中使用装饰性分隔注释，例如大段横线、框线或只写 `helpers`、`page` 的 banner。
- 不写重复代码含义的注释，例如 `// set loading state`。
- `eslint-disable`、`ts-ignore` 等规避必须缩小作用域，并在同一行或相邻行说明原因。

## 分层架构

项目按职责分为四层：

1. `src/app`：路由、页面编排、数据加载、用户流程状态。
2. `src/components`：可复用 UI 与业务组件。组件接收数据和回调，不直接拥有通用 API 工作流。
3. `src/lib/services`：API 面向业务的封装。Service 调用 `apiClient`，返回有类型的领域数据。
4. `src/lib/api`、`src/lib/stores`、`src/lib/navigation`：API 基础设施、共享状态、静态导航/搜索目录和跨页面纯工具。

分层规则：

- 页面可以导入 services。
- Services 可以导入 `apiClient` 和 API 类型。
- 共享组件不导入 service 函数。
- 导航、搜索目录、纯数据构建逻辑放在 `src/lib/navigation`，不要内嵌在 UI 组件里。
- `src/components/ui` 里的 UI 原语不导入 app 路由、services 或业务数据。

## React 与 UI

- 交互控件优先使用 `src/components/ui` 的本地设计系统组件。
- 业务页面和业务组件不直接写原生 `button`、`input`、`select`、`textarea`，除非是在封装新的 UI 原语。
- 有可见标签的表单行使用 `FormField` 统一标签、描述和错误信息。
- 自定义受控组件统一使用 `value` 加 `onValueChange`，例如 `Select`、`Tabs`。
- Client Component 保持聚焦；纯数据构建、过滤、目录组装放到 `src/lib`。
- 顶层组件和辅助函数优先使用 `function` 声明，除非框架 API 需要其它形式。

## 数据与状态

- Mock 数据保留在 `src/lib/api/mock-data.ts`。
- 数据转换靠近拥有该数据形状的层。
- Zustand 只保存跨路由会话状态、布局状态或确实需要共享的 UI 状态。
- 页面专用状态保留在页面组件内部。

## 错误处理

- 用户可见失败需要通过页面、弹窗、Toast 或表单错误展示。
- 样式清理或结构清理不得顺手扩大错误处理范围。
- 避免空 `catch`。如果必须忽略错误，需要说明忽略原因。

## 审查清单

修改代码前后至少检查：

- 文件、组件、函数和布尔变量命名是否符合语义。
- 是否存在装饰性注释、过期注释、调试代码或宽泛类型逃逸。
- 是否存在组件跨层导入 service、UI 原语导入业务数据等边界问题。
- 业务页面是否绕过设计系统直接使用原生交互控件。
- 新逻辑是否能用现有工具、组件和服务完成，避免新增重复抽象。

## 自动化 Lint 规则

`eslint.config.mjs` 内置本地 `webase` 规则，不引入额外依赖：

- `webase/file-name-kebab-case`：强制 `src` 下源文件使用 kebab-case，保留 Next.js 路由文件例外。
- `webase/no-decorative-comments`：禁止装饰性 banner 注释。
- `webase/no-raw-interactive-controls`：禁止业务层直接写原生 `button`、`input`、`select`、`textarea`。
- `webase/service-function-verb`：强制 service 导出函数使用批准的动词前缀。
- `webase/store-hook-name`：强制 Zustand store 导出名使用 `useXStore`。
- `no-restricted-imports`：按目录强制组件、UI 原语、services、lib 基础设施的导入边界。

规则烟雾测试：

```powershell
npm run lint:standards
```

## 验证

代码修改后运行：

```powershell
npm run lint:standards
npm run lint
.\node_modules\.bin\tsc.cmd --noEmit
npm run build
```

视觉或交互变更还需要在浏览器中检查受影响页面。
