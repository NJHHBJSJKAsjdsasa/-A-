# Doraemon Platform - Windows 部署脚本 (PowerShell)
# 需要以管理员身份运行

param(
    [ValidateSet("full", "db", "stop", "delete", "status", "logs", "help")]
    [string]$Command = "help",
    
    [string]$LogService = ""
)

$ErrorActionPreference = "Stop"

function Write-Header {
    param([string]$Text)
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host $Text -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Success {
    param([string]$Text)
    Write-Host "[成功] " -ForegroundColor Green -NoNewline
    Write-Host $Text
}

function Write-Error {
    param([string]$Text)
    Write-Host "[错误] " -ForegroundColor Red -NoNewline
    Write-Host $Text
}

function Write-Warning {
    param([string]$Text)
    Write-Host "[警告] " -ForegroundColor Yellow -NoNewline
    Write-Host $Text
}

function Write-Info {
    param([string]$Text)
    Write-Host "[信息] " -ForegroundColor Blue -NoNewline
    Write-Host $Text
}

function Test-Docker {
    try {
        $null = docker --version 2>&1
        return $true
    } catch {
        return $false
    }
}

function Test-DockerRunning {
    try {
        $null = docker info 2>&1
        return $true
    } catch {
        return $false
    }
}

function Get-ComposeCommand {
    try {
        $null = docker-compose --version 2>&1
        return "docker-compose"
    } catch {
        try {
            $null = docker compose --version 2>&1
            return "docker compose"
        } catch {
            throw "未找到 docker-compose 或 docker compose 命令"
        }
    }
}

function Invoke-FullDeploy {
    Write-Header "正在完整部署所有服务..."
    Write-Info "这可能需要 3-5 分钟，请耐心等待..."
    
    try {
        Invoke-Expression "$ComposeCmd up -d --build"
        Write-Success "部署完成！"
        Write-Host ""
        Write-Host "服务访问地址：" -ForegroundColor Cyan
        Write-Host "  - 前端: http://localhost:3000"
        Write-Host "  - API 网关: http://localhost:8080"
        Write-Host "  - MinIO 控制台: http://localhost:9001"
        Write-Host "    用户名: minioadmin"
        Write-Host "    密码: minioadmin123"
        Write-Host ""
        Write-Host "查看服务状态: .\windows-setup.ps1 -Command status"
        Write-Host "查看服务日志: .\windows-setup.ps1 -Command logs"
    } catch {
        Write-Error "部署失败：$_"
    }
}

function Invoke-DbOnly {
    Write-Header "正在启动数据库服务..."
    
    try {
        Invoke-Expression "$ComposeCmd up -d mongodb redis minio"
        Write-Success "数据库服务已启动！"
        Write-Host ""
        Write-Host "数据库连接信息：" -ForegroundColor Cyan
        Write-Host "  - MongoDB: mongodb://admin:admin123@localhost:27017/doraemon?authSource=admin"
        Write-Host "  - Redis: redis://localhost:6379"
        Write-Host "  - MinIO: http://localhost:9001"
        Write-Host "    用户名: minioadmin"
        Write-Host "    密码: minioadmin123"
    } catch {
        Write-Error "启动失败：$_"
    }
}

function Invoke-StopAll {
    Write-Header "正在停止所有服务..."
    
    try {
        Invoke-Expression "$ComposeCmd down"
        Write-Success "所有服务已停止！"
    } catch {
        Write-Error "停止失败：$_"
    }
}

function Invoke-DeleteAll {
    Write-Header "警告：这将删除所有数据！"
    
    $confirm = Read-Host "确认删除所有数据？(y/N)"
    if ($confirm -ne "y" -and $confirm -ne "Y") {
        Write-Info "已取消操作。"
        return
    }
    
    Write-Info "正在停止服务并删除所有数据..."
    
    try {
        Invoke-Expression "$ComposeCmd down -v"
        Write-Success "所有数据已删除！"
    } catch {
        Write-Error "删除失败：$_"
    }
}

function Invoke-Status {
    Write-Header "服务状态"
    
    try {
        Invoke-Expression "$ComposeCmd ps"
    } catch {
        Write-Error "获取状态失败：$_"
    }
}

function Invoke-Logs {
    Write-Header "查看服务日志"
    
    $services = @(
        "所有服务",
        "frontend",
        "api-gateway",
        "user-service",
        "community-service",
        "learning-service",
        "mongodb",
        "redis"
    )
    
    if (-not $LogService) {
        Write-Host "选择要查看日志的服务：" -ForegroundColor Cyan
        for ($i = 0; $i -lt $services.Count; $i++) {
            Write-Host "  $($i+1). $($services[$i])"
        }
        Write-Host ""
        $choice = Read-Host "请输入选项 (1-$($services.Count))"
        
        if ($choice -match "^\d+$" -and [int]$choice -ge 1 -and [int]$choice -le $services.Count) {
            $LogService = if ([int]$choice -eq 1) { "" } else { $services[[int]$choice - 1] }
        } else {
            Write-Error "无效选项！"
            return
        }
    }
    
    if ($LogService) {
        Write-Info "正在查看 $LogService 日志（按 Ctrl+C 退出）..."
        Invoke-Expression "$ComposeCmd logs -f $LogService"
    } else {
        Write-Info "正在查看所有服务日志（按 Ctrl+C 退出）..."
        Invoke-Expression "$ComposeCmd logs -f"
    }
}

function Show-Help {
    Write-Header "Doraemon Platform - Windows 部署脚本"
    Write-Host ""
    Write-Host "用法：" -ForegroundColor Cyan
    Write-Host "  .\windows-setup.ps1 [-Command <命令>] [-LogService <服务名>]"
    Write-Host ""
    Write-Host "命令：" -ForegroundColor Cyan
    Write-Host "  full    - 完整部署（所有服务）"
    Write-Host "  db      - 仅启动数据库（MongoDB + Redis + MinIO）"
    Write-Host "  stop    - 停止所有服务"
    Write-Host "  delete  - 停止并删除所有数据"
    Write-Host "  status  - 查看服务状态"
    Write-Host "  logs    - 查看服务日志"
    Write-Host "  help    - 显示帮助信息（默认）"
    Write-Host ""
    Write-Host "示例：" -ForegroundColor Cyan
    Write-Host "  .\windows-setup.ps1 -Command full"
    Write-Host "  .\windows-setup.ps1 -Command logs -LogService frontend"
    Write-Host ""
    Write-Host "或者直接运行脚本进行交互式选择：" -ForegroundColor Cyan
    Write-Host "  .\windows-setup.ps1"
}

function Show-InteractiveMenu {
    Write-Header "Doraemon Platform - Windows 部署脚本"
    
    Write-Host "选择部署选项：" -ForegroundColor Cyan
    Write-Host "  1. 完整部署（所有服务）"
    Write-Host "  2. 仅启动数据库（MongoDB + Redis + MinIO）"
    Write-Host "  3. 停止所有服务"
    Write-Host "  4. 停止并删除所有数据"
    Write-Host "  5. 查看服务状态"
    Write-Host "  6. 查看服务日志"
    Write-Host "  7. 退出"
    Write-Host ""
    
    $choice = Read-Host "请输入选项 (1-7)"
    
    switch ($choice) {
        "1" { Invoke-FullDeploy }
        "2" { Invoke-DbOnly }
        "3" { Invoke-StopAll }
        "4" { Invoke-DeleteAll }
        "5" { Invoke-Status }
        "6" { Invoke-Logs }
        "7" { Write-Info "再见！" }
        default { Write-Error "无效选项！" }
    }
}

# 主程序
try {
    Write-Header "Doraemon Platform - Windows 部署脚本"
    
    # 检查 Docker
    Write-Info "检查 Docker..."
    if (-not (Test-Docker)) {
        Write-Error "未检测到 Docker Desktop！"
        Write-Host ""
        Write-Host "请先安装 Docker Desktop：" -ForegroundColor Yellow
        Write-Host "https://www.docker.com/products/docker-desktop"
        Write-Host ""
        exit 1
    }
    Write-Success "检测到 Docker Desktop"
    
    # 检查 Docker 是否运行
    Write-Info "检查 Docker 运行状态..."
    if (-not (Test-DockerRunning)) {
        Write-Error "Docker Desktop 未运行！"
        Write-Host ""
        Write-Host "请启动 Docker Desktop 后再运行此脚本。" -ForegroundColor Yellow
        Write-Host ""
        exit 1
    }
    Write-Success "Docker Desktop 正在运行"
    
    # 获取 compose 命令
    $ComposeCmd = Get-ComposeCommand
    Write-Info "使用命令: $ComposeCmd"
    
    # 执行命令
    if ($Command -eq "help") {
        Show-InteractiveMenu
    } else {
        switch ($Command) {
            "full" { Invoke-FullDeploy }
            "db" { Invoke-DbOnly }
            "stop" { Invoke-StopAll }
            "delete" { Invoke-DeleteAll }
            "status" { Invoke-Status }
            "logs" { Invoke-Logs }
            default { Show-Help }
        }
    }
    
} catch {
    Write-Error "发生错误：$_"
    Write-Host $_.ScriptStackTrace -ForegroundColor DarkGray
    exit 1
}
