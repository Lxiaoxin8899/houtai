# 里程碑：集成 AdminJS 后台

## 背景
- 项目需要一个开箱即用的管理后台来检视和维护用户与会话数据。
- 期望方案必须兼容现有的双数据库架构（TypeORM/Postgres 与 Mongoose/MongoDB）并复用既有的认证、配置体系。

## 交付范围
1. **依赖与构建**  
   - 新增 `adminjs` 以及 `@adminjs/nestjs`、`@adminjs/typeorm`、`@adminjs/mongoose`、`@adminjs/express` 等适配器依赖。  
   - 更新 `tsconfig.json`，加入路径别名以在 CommonJS 构建下正确解析这些 ESM 套件。
2. **配置层**  
   - 新增 `admin` 配置块（`rootPath`、`cookieName`、`cookiePassword`），整合环境变量校验与通用配置类型。  
   - 在 `env-example-*.env` 中提供默认变量，确保部署可直接参考。
3. **模块结构**  
   - 实现 `AdminPanelModule`，在运行时根据 `databaseConfig().isDocumentDatabase` 选择关系型或文档型子模块。  
   - 对 TypeORM 模式：注册实体、挂载 AdminJS 资源，并透过 `DataSource` 注入。  
   - 对 Mongoose 模式：注册 Schema、构建 AdminJS 资源，并透过模型实例化。
4. **认证与资源定义**  
   - 复用 `UsersService` 与 `bcrypt` 校验，限制只有 `RoleEnum.admin` 用户可登录。  
   - 定义 `user`、`session` 资源的列表、筛选、隐藏字段等视图策略，屏蔽密码和已删除字段。
5. **文档更新**  
   - README 增补“Admin panel”章节，说明访问路径、默认帐号与安全注意事项。  
   - 产出本文档，概述里程碑进展。

## 验收动作
1. `npm run lint -- src/admin-panel/**/*.ts`
2. `npm run build`
3. 启动任一数据库模式，访问 `http://localhost:3000${ADMIN_PANEL_ROOT_PATH}`，以 `admin@example.com / secret`（或其他管理员）登录并验证用户/会话资源可读。

## 剩余工作（建议）
- 若计划对 AdminJS 扩展更多资源（文件、角色、状态等），可在 `admin-panel.resources.ts` 中追加配置。
- 为后台操作新增审计日志或权限细分（例如只读管理员）。
- 针对生产部署，结合反向代理/HTTPS/STO 进行 cookie 安全性加固，并考虑启用自定义主题。
