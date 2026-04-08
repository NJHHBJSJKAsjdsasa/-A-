@echo off
chcp 65001 >nul
echo ========================================
echo Doraemon Platform - Windows 部署脚本
echo ========================================
echo.

REM 检查 Docker Desktop 是否已安装
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Docker Desktop！
    echo.
    echo 请先安装 Docker Desktop：
    echo https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

echo [成功] 检测到 Docker Desktop
echo.

REM 检查 Docker Desktop 是否正在运行
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] Docker Desktop 未运行！
    echo.
    echo 请启动 Docker Desktop 后再运行此脚本。
    echo.
    pause
    exit /b 1
)

echo [成功] Docker Desktop 正在运行
echo.

REM 检查 docker-compose 是否可用
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [警告] 未检测到 docker-compose，尝试使用 docker compose
    set COMPOSE_CMD=docker compose
) else (
    set COMPOSE_CMD=docker-compose
)

echo.
echo ========================================
echo 选择部署选项：
echo ========================================
echo 1. 完整部署（所有服务）
echo 2. 仅启动数据库（MongoDB + Redis + MinIO）
echo 3. 停止所有服务
echo 4. 停止并删除所有数据
echo 5. 查看服务状态
echo 6. 查看服务日志
echo.
set /p choice=请输入选项 (1-6):

if "%choice%"=="1" goto full_deploy
if "%choice%"=="2" goto db_only
if "%choice%"=="3" goto stop_all
if "%choice%"=="4" goto delete_all
if "%choice%"=="5" goto status
if "%choice%"=="6" goto logs
echo [错误] 无效选项！
pause
exit /b 1

:full_deploy
echo.
echo ========================================
echo 正在完整部署所有服务...
echo ========================================
echo.
echo 这可能需要 3-5 分钟，请耐心等待...
echo.
%COMPOSE_CMD% up -d --build
if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo [成功] 部署完成！
    echo ========================================
    echo.
    echo 服务访问地址：
    echo - 前端: http://localhost:3000
    echo - API 网关: http://localhost:8080
    echo - MinIO 控制台: http://localhost:9001
    echo   用户名: minioadmin
    echo   密码: minioadmin123
    echo.
    echo 查看服务状态: %~nx0 5
    echo 查看服务日志: %~nx0 6
    echo.
) else (
    echo.
    echo [错误] 部署失败！
    echo.
)
goto end

:db_only
echo.
echo ========================================
echo 正在启动数据库服务...
echo ========================================
echo.
%COMPOSE_CMD% up -d mongodb redis minio
if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo [成功] 数据库服务已启动！
    echo ========================================
    echo.
    echo 数据库连接信息：
    echo - MongoDB: mongodb://admin:admin123@localhost:27017/doraemon?authSource=admin
    echo - Redis: redis://localhost:6379
    echo - MinIO: http://localhost:9001
    echo   用户名: minioadmin
    echo   密码: minioadmin123
    echo.
) else (
    echo.
    echo [错误] 启动失败！
    echo.
)
goto end

:stop_all
echo.
echo ========================================
echo 正在停止所有服务...
echo ========================================
echo.
%COMPOSE_CMD% down
if %errorlevel% equ 0 (
    echo.
    echo [成功] 所有服务已停止！
    echo.
) else (
    echo.
    echo [错误] 停止失败！
    echo.
)
goto end

:delete_all
echo.
echo ========================================
echo 警告：这将删除所有数据！
echo ========================================
echo.
set /p confirm=确认删除所有数据？(y/N):
if /i not "%confirm%"=="y" (
    echo 已取消操作。
    goto end
)
echo.
echo 正在停止服务并删除所有数据...
echo.
%COMPOSE_CMD% down -v
if %errorlevel% equ 0 (
    echo.
    echo [成功] 所有数据已删除！
    echo.
) else (
    echo.
    echo [错误] 删除失败！
    echo.
)
goto end

:status
echo.
echo ========================================
echo 服务状态
echo ========================================
echo.
%COMPOSE_CMD% ps
echo.
goto end

:logs
echo.
echo ========================================
echo 查看服务日志
echo ========================================
echo.
echo 选择要查看日志的服务：
echo 1. 所有服务
echo 2. 前端
echo 3. API 网关
echo 4. 用户服务
echo 5. 社区服务
echo 6. 学习服务
echo 7. MongoDB
echo 8. Redis
echo.
set /p log_choice=请输入选项 (1-8):

if "%log_choice%"=="1" set LOG_SERVICE=
if "%log_choice%"=="2" set LOG_SERVICE=frontend
if "%log_choice%"=="3" set LOG_SERVICE=api-gateway
if "%log_choice%"=="4" set LOG_SERVICE=user-service
if "%log_choice%"=="5" set LOG_SERVICE=community-service
if "%log_choice%"=="6" set LOG_SERVICE=learning-service
if "%log_choice%"=="7" set LOG_SERVICE=mongodb
if "%log_choice%"=="8" set LOG_SERVICE=redis

if "%LOG_SERVICE%"=="" (
    echo.
    echo 正在查看所有服务日志（按 Ctrl+C 退出）...
    echo.
    %COMPOSE_CMD% logs -f
) else (
    echo.
    echo 正在查看 %LOG_SERVICE% 日志（按 Ctrl+C 退出）...
    echo.
    %COMPOSE_CMD% logs -f %LOG_SERVICE%
)

:end
echo.
pause
