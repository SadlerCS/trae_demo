# 点评网站

一个简化版的大众点评网站应用，为用户提供本地商家信息浏览、评价和搜索服务。

## 功能特性

### 用户功能
- 🔍 商家搜索和分类浏览
- 📱 响应式设计，支持移动端
- ⭐ 商家评价和评分系统
- 💖 商家收藏功能
- 👤 个人中心管理
- 🔐 用户认证系统（邮箱/手机号注册登录）

### 管理功能
- 🏪 商家信息管理
- 📊 数据统计面板
- 📝 评价内容管理
- ✅ 商家审核系统

## 技术栈

- **前端框架**: React 18 + TypeScript
- **UI框架**: Ant Design 5 + Tailwind CSS
- **状态管理**: Zustand
- **后端服务**: Supabase (BaaS)
- **数据库**: PostgreSQL
- **认证**: Supabase Auth
- **构建工具**: Vite

## 快速开始

### 环境要求
- Node.js 18+
- npm 或 pnpm

### 安装依赖
```bash
npm install
```

### 环境配置
1. 复制 `.env.example` 为 `.env`
2. 配置 Supabase 项目信息：
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 开发运行
```bash
npm run dev
```

### 构建部署
```bash
npm run build
```

## 项目结构

```
src/
├── components/          # 可复用组件
│   └── Layout/         # 布局组件
├── hooks/              # 自定义Hooks
├── lib/                # 工具库和配置
├── pages/              # 页面组件
│   └── Admin/          # 管理后台页面
├── styles/             # 样式文件
└── utils/              # 工具函数

supabase/
└── migrations/         # 数据库迁移文件
```

## 数据库设计

### 主要表结构
- **users**: 用户表（扩展Supabase Auth）
- **categories**: 商家分类表
- **businesses**: 商家信息表
- **reviews**: 用户评价表
- **favorites**: 用户收藏表

### 安全策略
- 行级安全(RLS)策略
- 基于角色的访问控制
- 数据验证和清理

## 部署

### Vercel 部署
1. 连接 GitHub 仓库
2. 配置环境变量
3. 自动部署

### 自建部署
1. 构建项目：`npm run build`
2. 配置 Web 服务器
3. 设置环境变量

## 开发指南

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 React Hooks 规则
- 组件保持单一职责
- 使用语义化 HTML 标签

### 性能优化
- 图片懒加载
- 组件懒加载
- 缓存策略
- 移动端优化

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 发起 Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过以下方式联系：
- 邮箱: [your-email@example.com]
- GitHub Issues

---

⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！