# Doraemon Platform - Windows 部署指南

本指南介绍如何在 Windows 系统上部署 Doraemon Multilingual Platform。

## 目录
1. [使用 Docker Desktop 部署](#使用-docker-desktop-部署)
2. [使用 WSL 2 部署](#使用-wsl-2-部署)
3. [本地开发环境部署](#本地开发环境部署)
4. [常见问题解决](#常见问题解决)

---

## 使用 Docker Desktop 部署

这是最简单的 Windows 部署方式，推荐使用。

### 前置要求
- Windows 10 专业版/企业版/教育版（版本 1909 或更高）或 Windows 11
- 至少 8GB RAM（推荐 16GB）
- 至少 20GB 可用磁盘空间

### 步骤 1：安装 Docker Desktop
1. 访问 [Docker 官网](https://www.docker.com/products/docker-desktop)
2. 下载 Windows 版本的 Docker Desktop
3. 运行安装程序，按照提示完成安装
4. 重启电脑
5. 启动 Docker Desktop，等待 Docker Engine 启动完成

### 步骤 2：配置 Docker Desktop
1. 打开 Docker Desktop 设置
2. 进入 "Resources" -> "Advanced"
3. 调整内存分配（建议 4GB-8GB）
4. 调整 CPU 核心数（建议 2-4 核心）
5. 点击 "Apply & Restart"

### 步骤 3：下载项目代码
```powershell
# 在 PowerShell 中执行
cd C:\Users\YourUsername\Projects
git clone <项目仓库地址>
cd doraemon-platform
```

### 步骤 4：启动服务
```powershell
# 在项目根目录下执行
docker-compose up -d
```

等待所有服务启动完成（约 3-5 分钟）

### 步骤 5：验证部署
- 前端访问：http://localhost:3000
- API 网关：http://localhost:8080
- MinIO 控制台：http://localhost:9001
  - 用户名：minioadmin
  - 密码：minioadmin123

### 停止服务
```powershell
docker-compose down
```

### 删除所有数据（谨慎使用）
```powershell
docker-compose down -v
```

---

## 使用 WSL 2 部署

如果你想获得更好的性能，可以使用 WSL 2。

### 前置要求
- Windows 10 版本 2004 及更高版本，或 Windows 11
- 启用 WSL 2

### 步骤 1：启用 WSL 2
以管理员身份打开 PowerShell，执行：
```powershell
wsl --install
```
重启电脑后，WSL 2 将自动安装 Ubuntu。

### 步骤 2：设置 WSL 2 为默认
```powershell
wsl --set-default-version 2
```

### 步骤 3：在 WSL 2 中安装 Docker
1. 打开 Ubuntu 终端
2. 更新系统：
```bash
sudo apt update
sudo apt upgrade -y
```

3. 安装 Docker：
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

4. 安装 Docker Compose：
```bash
sudo apt install docker-compose -y
```

5. 将当前用户添加到 docker 组：
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### 步骤 4：在 WSL 2 中部署项目
```bash
# 进入用户目录
cd ~

# 克隆项目
git clone <项目仓库地址>
cd doraemon-platform

# 启动服务
docker-compose up -d
```

---

## 本地开发环境部署

如果你想在 Windows 上进行开发，可以不使用 Docker。

### 前置要求
- Node.js 18.0.0 或更高版本
- MongoDB 6.0 或更高版本
- Redis 7.0 或更高版本
- MinIO（可选，用于文件存储）

### 步骤 1：安装 Node.js
1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载 LTS 版本
3. 运行安装程序，按照提示完成安装
4. 验证安装：
```powershell
node --version
npm --version
```

### 步骤 2：安装 MongoDB
#### 选项 A：使用 MongoDB Community Server
1. 访问 [MongoDB 官网](https://www.mongodb.com/try/download/community)
2. 下载 Windows 版本
3. 运行安装程序，按照提示完成安装
4. 启动 MongoDB 服务

#### 选项 B：使用 MongoDB Atlas（云端）
1. 访问 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 创建免费账户
3. 创建集群，获取连接字符串

### 步骤 3：安装 Redis
Windows 上安装 Redis 的最简单方法是使用 Memurai 或 WSL 2。

#### 选项 A：使用 Memurai
1. 访问 [Memurai 官网](https://www.memurai.com/)
2. 下载并安装 Memurai Developer
3. 启动 Memurai 服务

#### 选项 B：在 WSL 2 中使用 Redis
```bash
# 在 Ubuntu 终端中执行
sudo apt install redis-server -y
sudo service redis-server start
```

### 步骤 4：安装项目依赖
```powershell
# 在项目根目录下执行
npm install
```

### 步骤 5：配置环境变量
在每个服务目录中创建 `.env` 文件：

**services/user-service/.env**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/doraemon
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
```

**services/api-gateway/.env**
```env
PORT=8080
JWT_SECRET=your-jwt-secret-key
USER_SERVICE_URL=http://localhost:3001
COMMUNITY_SERVICE_URL=http://localhost:3002
MESSAGE_SERVICE_URL=http://localhost:3003
ACHIEVEMENT_SERVICE_URL=http://localhost:3004
LEARNING_SERVICE_URL=http://localhost:3005
FILE_SERVICE_URL=http://localhost:3006
```

**frontend/.env**
```env
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080
```

### 步骤 6：启动服务
```powershell
# 在项目根目录下执行
npm run dev
```

这将启动所有服务和前端开发服务器。

---

## 常见问题解决

### 1. Docker Desktop 启动失败
**问题**：Docker Desktop 无法启动或报错。

**解决方案**：
- 确保 Hyper-V 和 WSL 2 已启用
- 检查是否有其他虚拟化软件冲突
- 尝试重启 Docker Desktop
- 查看 Docker Desktop 日志

### 2. 端口被占用
**问题**：启动服务时提示端口已被占用。

**解决方案**：
- 查找占用端口的进程：
```powershell
netstat -ano | findstr :3000
```
- 结束占用端口的进程，或修改 docker-compose.yml 中的端口映射

### 3. 内存不足
**问题**：服务启动失败，提示内存不足。

**解决方案**：
- 增加 Docker Desktop 的内存分配
- 关闭其他占用内存的程序
- 使用更少的服务（只启动需要的服务）

### 4. 文件权限问题（WSL 2）
**问题**：在 WSL 2 中访问 Windows 文件系统时出现权限问题。

**解决方案**：
- 尽量在 WSL 2 文件系统中工作（~/ 目录）
- 如果必须访问 Windows 文件，确保正确配置权限

### 5. MongoDB 连接失败
**问题**：服务无法连接到 MongoDB。

**解决方案**：
- 确认 MongoDB 服务正在运行
- 检查连接字符串是否正确
- 检查防火墙设置

### 6. npm install 失败
**问题**：安装依赖时出现错误。

**解决方案**：
```powershell
# 清除 npm 缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

---

## 性能优化建议

### Windows 性能优化
1. 使用 WSL 2 而不是 Docker Desktop 的 Hyper-V 后端
2. 将项目文件放在 WSL 2 文件系统中
3. 增加 Docker Desktop 的资源分配
4. 关闭不必要的 Windows 服务

### 开发环境优化
1. 使用 VS Code 的 WSL 扩展
2. 启用热重载
3. 使用 Node.js 调试工具
4. 配置合理的 linting 和格式化

---

## 下一步
- 查看 [README.md](README.md) 了解项目架构
- 查看 [API 文档](docs/API.md) 了解 API 接口
- 开始开发！
