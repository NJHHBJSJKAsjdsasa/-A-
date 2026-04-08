# 哆啦A梦多语言平台 (Doraemon Multilingual Platform)

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 一个综合性的哆啦A梦粉丝社区平台，结合语言学习与社交交流功能，支持多语言国际化。

## 🌟 项目特色

- 🌍 **多语言支持** - 支持中文、英语、日语、韩语四种语言
- 👥 **社区交流** - 帖子发布、评论互动、话题圈子
- 💬 **即时通讯** - 私信、群聊、实时消息推送
- 🏆 **成就系统** - 等级、徽章、积分、排行榜激励
- 📚 **语言学习** - 多语言课程、课时学习、进度追踪
- 🔐 **多种登录** - 邮箱、手机、微信、QQ、微博 OAuth

## 🏗️ 系统架构

本项目采用**微服务架构**，各服务独立部署、独立扩展：

```
┌─────────────────────────────────────────────────────────────┐
│                      前端层 (React SPA)                       │
│         React 18 + TypeScript + Redux Toolkit + i18n         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API 网关 (Port: 8080)                      │
│         统一入口 · 认证授权 · 限流保护 · 路由分发              │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   用户服务     │    │   社区服务     │    │   消息服务     │
│   Port: 3001  │    │   Port: 3002  │    │   Port: 3003  │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   成就服务     │    │   学习服务     │    │   文件服务     │
│   Port: 3004  │    │   Port: 3005  │    │   Port: 3006  │
└───────────────┘    └───────────────┘    └───────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        数据层                                │
│              MongoDB + Redis + MinIO                        │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **状态管理**: Redux Toolkit + RTK Query
- **样式**: TailwindCSS
- **构建**: Vite
- **国际化**: i18next
- **实时通信**: Socket.io-client

### 后端
- **运行时**: Node.js 18+ LTS
- **框架**: Express.js
- **数据库**: MongoDB 6.0+ (Mongoose ODM)
- **缓存**: Redis 7.0+
- **文件存储**: MinIO
- **认证**: JWT + OAuth 2.0

### 基础设施
- **容器化**: Docker + Docker Compose
- **编排**: Kubernetes
- **反向代理**: Nginx

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- MongoDB >= 6.0
- Redis >= 7.0

### 1. 克隆项目

```bash
git clone https://github.com/NJHHBJSJKAsjdsasa/-A-.git
cd -A-
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env`，并配置以下变量：

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/doraemon

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# MinIO (文件服务)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
```

### 4. 启动服务

#### 方式一：Docker Compose（推荐）

```bash
docker-compose up -d
```

#### 方式二：本地开发模式

```bash
# 启动所有服务（前端 + 后端微服务）
npm run dev
```

或者单独启动：

```bash
# 前端
npm run dev:frontend

# 各个微服务
npm run dev:gateway    # API 网关
npm run dev:user       # 用户服务
npm run dev:community  # 社区服务
npm run dev:message    # 消息服务
npm run dev:achievement # 成就服务
npm run dev:learning   # 学习服务
npm run dev:file       # 文件服务
```

### 5. 访问应用

- 🌐 **前端界面**: http://localhost:3000
- 🔌 **API 网关**: http://localhost:8080
- 📊 **MinIO 控制台**: http://localhost:9001

## 📁 项目结构

```
doraemon-platform/
├── frontend/                    # 前端应用
│   ├── src/
│   │   ├── components/         # 公共组件
│   │   ├── pages/              # 页面组件
│   │   ├── store/              # Redux store
│   │   ├── locales/            # 国际化语言包
│   │   └── services/           # API 服务
│   └── package.json
│
├── services/                    # 微服务
│   ├── api-gateway/            # API 网关
│   ├── user-service/           # 用户服务
│   ├── community-service/      # 社区服务
│   ├── message-service/        # 消息服务
│   ├── achievement-service/    # 成就服务
│   ├── learning-service/       # 学习服务
│   ├── file-service/           # 文件服务
│   └── shared/                 # 共享模块
│
├── k8s/                        # Kubernetes 配置
├── scripts/                    # 脚本文件
├── docker-compose.yml          # Docker Compose 配置
└── package.json                # 根 package.json
```

## 🔌 API 接口

### 认证相关
```
POST   /api/auth/register          # 用户注册
POST   /api/auth/login             # 用户登录
POST   /api/auth/refresh-token     # 刷新令牌
GET    /api/auth/oauth/:provider   # OAuth 登录
```

### 用户相关
```
GET    /api/users/:id              # 获取用户信息
PUT    /api/users/:id              # 更新用户信息
PUT    /api/users/:id/password     # 修改密码
GET    /api/users/me               # 获取当前用户
```

### 社区相关
```
GET    /api/posts                  # 获取帖子列表
POST   /api/posts                  # 创建帖子
GET    /api/posts/:id              # 获取帖子详情
POST   /api/posts/:id/like         # 点赞帖子
POST   /api/posts/:id/comments     # 发表评论
GET    /api/circles                # 获取圈子列表
POST   /api/circles                # 创建圈子
POST   /api/circles/:id/join       # 加入圈子
```

### 学习相关
```
GET    /api/courses                # 获取课程列表
GET    /api/courses/:id            # 获取课程详情
POST   /api/courses/:id/enroll     # 报名课程
GET    /api/lessons/:id            # 获取课时详情
POST   /api/lessons/:id/complete   # 完成课时
GET    /api/learning/progress      # 获取学习进度
```

更多 API 请参考各服务的路由文件。

## 🐳 Docker 部署

### 构建镜像

```bash
npm run docker:build
```

### 启动所有服务

```bash
npm run docker:up
```

### 停止服务

```bash
npm run docker:down
```

## ☸️ Kubernetes 部署

```bash
# 应用所有配置
kubectl apply -f k8s/

# 删除所有资源
kubectl delete -f k8s/
```

## 🧪 测试

```bash
# 运行所有测试
npm run test

# 运行特定服务测试
npm run test --workspace=services/user-service
```

## 🔧 开发指南

### 添加新微服务

1. 在 `services/` 目录下创建新服务文件夹
2. 参考现有服务结构，创建 `package.json`、`tsconfig.json`
3. 实现服务逻辑
4. 在 `docker-compose.yml` 中添加服务配置
5. 在 `k8s/deployments/` 中添加 K8s 配置

### 代码规范

```bash
# 运行 ESLint
npm run lint

# 自动修复
npm run lint:fix
```

## 📝 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NODE_ENV` | 运行环境 | `development` |
| `PORT` | 服务端口 | 各服务不同 |
| `MONGODB_URI` | MongoDB 连接字符串 | - |
| `REDIS_URL` | Redis 连接字符串 | - |
| `JWT_SECRET` | JWT 签名密钥 | - |
| `JWT_REFRESH_SECRET` | JWT 刷新密钥 | - |
| `MINIO_ENDPOINT` | MinIO 地址 | `localhost` |
| `MINIO_PORT` | MinIO 端口 | `9000` |
| `MINIO_ACCESS_KEY` | MinIO 访问密钥 | - |
| `MINIO_SECRET_KEY` | MinIO 秘密密钥 | - |

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目基于 [MIT](LICENSE) 许可证开源。

## 🙏 致谢

- [React](https://react.dev/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Redis](https://redis.io/)
- [TailwindCSS](https://tailwindcss.com/)

---

<p align="center">
  Made with ❤️ for Doraemon Fans
</p>
