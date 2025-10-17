# 青少年爱国教育平台 - 用户端

基于个性化推荐的青少年爱国教育平台设计与实现，使用 Vue 3 + JavaScript 开发。

## 项目简介

本项目是一个面向青少年的爱国主义教育平台用户端，旨在通过个性化推荐系统，为青少年提供优质的爱国主义教育内容，包括文章学习、视频学习、社区交流等功能。

## 系统架构

项目采用三大核心模块：

### 1. 用户模块
- **注册（邮箱验证）**：支持邮箱验证的用户注册
- **登录**：用户身份认证
- **个人信息编辑**：修改个人资料
- **学习信息查看**：查看学习历史、积分明细等

### 2. 内容管理模块
- **文章学习**：浏览和学习爱国主义相关文章
- **视频学习**：观看教育视频内容
- **积分积累**：通过学习和互动获取积分
- **系统浏览筛选推荐**：基于用户兴趣的个性化内容推荐

### 3. 社区模块
- **签到打卡**：每日签到获取积分奖励
- **论坛模块**：发表和浏览论坛帖子
- **话题模块**：参与话题讨论
- **社区等级**：用户等级体系和排行榜

## 技术栈

- **前端框架**：Vue 3 (Composition API)
- **路由管理**：Vue Router 4
- **状态管理**：Pinia
- **UI 组件库**：Element Plus
- **HTTP 客户端**：Axios
- **构建工具**：Vite
- **开发语言**：JavaScript

## 项目结构

```
patriotic-education-user/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口
│   │   ├── request.js     # axios 封装
│   │   ├── user.js        # 用户相关接口
│   │   ├── content.js     # 内容相关接口
│   │   └── community.js   # 社区相关接口
│   ├── assets/            # 资源文件
│   │   └── logo.png       # Logo
│   ├── layouts/           # 布局组件
│   │   └── MainLayout.vue # 主布局（导航栏+底部）
│   ├── router/            # 路由配置
│   │   └── index.js       # 路由定义
│   ├── stores/            # 状态管理
│   │   └── user.js        # 用户状态
│   ├── styles/            # 全局样式
│   │   └── global.css     # 全局样式文件
│   ├── views/             # 页面组件
│   │   ├── Home.vue       # 首页
│   │   ├── user/          # 用户模块
│   │   │   ├── Login.vue        # 登录
│   │   │   ├── Register.vue     # 注册
│   │   │   ├── Profile.vue      # 个人信息
│   │   │   └── LearningInfo.vue # 学习信息
│   │   ├── content/       # 内容模块
│   │   │   ├── ArticleLearning.vue  # 文章学习
│   │   │   ├── ArticleDetail.vue    # 文章详情
│   │   │   ├── VideoLearning.vue    # 视频学习
│   │   │   ├── VideoDetail.vue      # 视频详情
│   │   │   └── Integration.vue      # 积分积累
│   │   └── community/     # 社区模块
│   │       ├── Community.vue   # 社区首页
│   │       ├── CheckIn.vue     # 签到打卡
│   │       ├── Forum.vue       # 论坛模块
│   │       ├── TopicDetail.vue # 话题详情
│   │       └── Ranking.vue     # 社区等级
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── index.html             # HTML 模板
├── vite.config.js         # Vite 配置
├── package.json           # 项目依赖
└── README.md             # 项目说明

```

## 功能特性

### 用户模块
- ✅ 用户注册（支持邮箱验证码）
- ✅ 用户登录（记住登录状态）
- ✅ 个人信息管理（头像、昵称、签名等）
- ✅ 学习历史记录
- ✅ 积分明细查看
- ✅ 学习统计图表

### 内容模块
- ✅ 文章分类浏览和筛选
- ✅ 视频分类浏览和筛选
- ✅ 个性化内容推荐
- ✅ 文章/视频详情页
- ✅ 点赞、收藏、分享功能
- ✅ 评论互动
- ✅ 学习进度追踪
- ✅ 积分奖励系统

### 社区模块
- ✅ 每日签到打卡
- ✅ 签到奖励和排行榜
- ✅ 论坛发帖和回复
- ✅ 话题讨论
- ✅ 多维度排行榜（积分、签到、学习、贡献）
- ✅ 用户等级体系
- ✅ 社区活动和公告

### UI/UX 特性
- 🎨 现代化的渐变色设计
- 📱 完全响应式布局，适配移动端
- 🎯 统一的导航栏和底部
- ⚡ 流畅的页面过渡动画
- 🌈 丰富的交互反馈
- 📊 数据可视化展示

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000 查看项目

### 生产构建

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## API 配置

项目使用 Vite 的代理配置来处理 API 请求。在 `vite.config.js` 中配置：

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080', // 后端服务地址
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

## 路由说明

| 路径 | 说明 | 权限 |
|------|------|------|
| `/login` | 登录页面 | 公开 |
| `/register` | 注册页面 | 公开 |
| `/home` | 首页 | 公开 |
| `/profile` | 个人信息 | 需登录 |
| `/learning-info` | 学习信息 | 需登录 |
| `/article-learning` | 文章学习 | 公开 |
| `/article-detail/:id` | 文章详情 | 公开 |
| `/video-learning` | 视频学习 | 公开 |
| `/video-detail/:id` | 视频详情 | 公开 |
| `/integration` | 积分积累 | 需登录 |
| `/community` | 社区首页 | 公开 |
| `/check-in` | 签到打卡 | 需登录 |
| `/forum` | 论坛模块 | 公开 |
| `/topic/:id` | 话题详情 | 公开 |
| `/ranking` | 社区等级 | 公开 |

## 状态管理

使用 Pinia 进行状态管理，主要包括：

- **用户状态**（`stores/user.js`）
  - 登录状态
  - 用户信息
  - Token 管理
  - 本地存储同步

## 开发规范

### 代码风格
- 使用 ES6+ 语法
- 组件使用 Composition API
- 遵循 Vue 3 官方风格指南

### 命名规范
- 组件文件：PascalCase（如 `UserProfile.vue`）
- 普通文件：camelCase（如 `userApi.js`）
- 常量：UPPER_SNAKE_CASE（如 `API_BASE_URL`）

### Git 提交规范
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具相关

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 后续计划

- [ ] 接入真实后端 API
- [ ] 实现个性化推荐算法
- [ ] 添加更多互动功能
- [ ] 优化移动端体验
- [ ] 添加数据统计和分析
- [ ] 实现内容搜索功能
- [ ] 添加消息通知系统
- [ ] 集成第三方登录

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系：
- 邮箱：contact@patriotic-edu.com
- 电话：400-123-4567

---

**注意**：本项目目前使用模拟数据，实际部署时需要连接真实的后端服务。