# ============================================================================
# MMS-UI 综合开发工具菜单 (PowerShell 版本)
# 基于 Vue3 + TypeScript + Vite 项目的完整开发环境管理工具
# ============================================================================

# 设置控制台编码为 UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 项目信息
$PROJECT_NAME = "mms-ui"
$PROJECT_VERSION = if (Test-Path "package.json") { 
    (Get-Content "package.json" | ConvertFrom-Json).version 
} else { "Unknown" }
$NODE_MIN_VERSION = "18.0.0"
$RECOMMENDED_NODE = "20.19.5"

# 颜色函数
function Write-ColorText {
    param([string]$Text, [string]$Color = "White")
    Write-Host $Text -ForegroundColor $Color
}

# 检查命令是否存在
function Test-Command {
    param([string]$Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

# 显示标题
function Show-Header {
    Clear-Host
    Write-ColorText "╔══════════════════════════════════════════════════════════╗" "Cyan"
    Write-ColorText "║               MMS-UI 综合开发工具菜单                   ║" "White"
    Write-ColorText "╠══════════════════════════════════════════════════════════╣" "Cyan"
    Write-ColorText "║ 项目版本: $PROJECT_VERSION                                    ║" "Yellow"
    Write-ColorText "║ 技术栈: Vue3 + TypeScript + Vite                  ║" "Yellow"
    Write-ColorText "╚══════════════════════════════════════════════════════════╝" "Cyan"
    Write-Host ""
}

# 显示环境信息
function Show-Environment {
    Write-ColorText "📋 当前环境信息:" "Blue"
    Write-ColorText "─────────────────────────────────────────────────────────────" "Gray"
    
    # Node.js 版本
    if (Test-Command "node") {
        $nodeVersion = node --version
        Write-ColorText "  ✅ Node.js: $nodeVersion" "Green"
    } else {
        Write-ColorText "  ❌ Node.js: 未安装" "Red"
    }
    
    # npm 版本
    if (Test-Command "npm") {
        $npmVersion = npm --version
        Write-ColorText "  ✅ npm: v$npmVersion" "Green"
    } else {
        Write-ColorText "  ❌ npm: 未安装" "Red"
    }
    
    # pnpm 版本
    if (Test-Command "pnpm") {
        $pnpmVersion = pnpm --version
        Write-ColorText "  ✅ pnpm: v$pnpmVersion" "Green"
    } else {
        Write-ColorText "  ⚠️  pnpm: 未安装" "Yellow"
    }
    
    # nvm 版本 (Windows)
    if (Test-Command "nvm") {
        try {
            $nvmVersion = nvm version
            Write-ColorText "  ✅ nvm: $nvmVersion" "Green"
        } catch {
            Write-ColorText "  ⚠️  nvm: 未正确配置" "Yellow"
        }
    } else {
        Write-ColorText "  ⚠️  nvm: 未安装" "Yellow"
    }
    
    # 当前镜像源
    if (Test-Command "npm") {
        try {
            $registry = npm config get registry
            if ($registry -like "*npmmirror.com*") {
                Write-ColorText "  ✅ 镜像源: 淘宝镜像 ($registry)" "Green"
            } else {
                Write-ColorText "  ⚠️  镜像源: $registry" "Yellow"
            }
        } catch {
            Write-ColorText "  ❌ 镜像源: 获取失败" "Red"
        }
    }
    
    Write-Host ""
}

# 显示主菜单
function Show-MainMenu {
    Write-ColorText "🚀 请选择功能:" "Magenta"
    Write-ColorText "─────────────────────────────────────────────────────────────" "Gray"
    Write-Host "  1)  Node.js 环境管理 (NVM)"
    Write-Host "  2)  镜像源配置与加速"
    Write-Host "  3)  依赖安装与管理"
    Write-Host "  4)  项目启动与构建"
    Write-Host "  5)  代码质量检查与修复"
    Write-Host "  6)  环境诊断与优化"
    Write-Host "  7)  缓存清理与重置"
    Write-Host "  8)  项目信息与帮助"
    Write-ColorText "─────────────────────────────────────────────────────────────" "Gray"
    Write-ColorText "  0)  退出" "Red"
    Write-Host ""
}

# Node.js 环境管理菜单
function Show-NodejsManagementMenu {
    do {
        Show-Header
        Show-Environment
        Write-ColorText "🔧 Node.js 环境管理 (NVM):" "Magenta"
        Write-ColorText "─────────────────────────────────────────────────────────────" "Gray"
        Write-Host "  1)  安装 NVM for Windows"
        Write-Host "  2)  安装推荐 Node.js 版本 ($RECOMMENDED_NODE)"
        Write-Host "  3)  安装最新 LTS Node.js"
        Write-Host "  4)  切换 Node.js 版本"
        Write-Host "  5)  查看已安装的 Node.js 版本"
        Write-Host "  6)  设置默认 Node.js 版本"
        Write-Host "  7)  升级 npm 到最新版本"
        Write-ColorText "─────────────────────────────────────────────────────────────" "Gray"
        Write-ColorText "  0)  返回主菜单" "Red"
        Write-Host ""
        $choice = Read-Host "请选择 (0-7)"
        
        switch ($choice) {
            "1" { Install-NVM }
            "2" { Install-RecommendedNode }
            "3" { Install-LatestLtsNode }
            "4" { Switch-NodeVersion }
            "5" { List-NodeVersions }
            "6" { Set-DefaultNode }
            "7" { Upgrade-Npm }
            "0" { break }
            default { 
                Write-ColorText "❌ 无效选择，请重试" "Red"
                Start-Sleep -Seconds 2
            }
        }
    } while ($choice -ne "0")
}

# 镜像源配置菜单
function Show-MirrorManagementMenu {
    do {
        Show-Header
        Show-Environment
        Write-ColorText "🌐 镜像源配置与加速:" "Magenta"
        Write-ColorText "─────────────────────────────────────────────────────────────" "Gray"
        Write-Host "  1)  一键配置淘宝镜像 (推荐)"
        Write-Host "  2)  验证镜像配置"
        Write-Host "  3)  测试镜像速度"
        Write-Host "  4)  切换到官方镜像"
        Write-Host "  5)  配置 PNPM 镜像"
        Write-Host "  6)  显示当前镜像配置"
        Write-Host "  7)  镜像源对比测试"
        Write-ColorText "─────────────────────────────────────────────────────────────" "Gray"
        Write-ColorText "  0)  返回主菜单" "Red"
        Write-Host ""
        $choice = Read-Host "请选择 (0-7)"
        
        switch ($choice) {
            "1" { Setup-TaobaoMirror }
            "2" { Verify-Mirrors }
            "3" { Test-MirrorSpeed }
            "4" { Switch-ToOfficial }
            "5" { Setup-PnpmMirror }
            "6" { Show-CurrentMirrors }
            "7" { Compare-Mirrors }
            "0" { break }
            default { 
                Write-ColorText "❌ 无效选择，请重试" "Red"
                Start-Sleep -Seconds 2
            }
        }
    } while ($choice -ne "0")
}

# 依赖安装与管理菜单
function Show-DependencyManagementMenu {
    do {
        Show-Header
        Show-Environment
        Write-ColorText "📦 依赖安装与管理:" "Magenta"
        Write-ColorText "─────────────────────────────────────────────────────────────" "Gray"
        Write-Host "  1)  NPM 快速安装依赖"
        Write-Host "  2)  PNPM 快速安装依赖"
        Write-Host "  3)  安装 PNPM (如果未安装)"
        Write-Host "  4)  检查依赖安全漏洞"
        Write-Host "  5)  更新依赖到最新版本"
        Write-Host "  6)  分析依赖包大小"
        Write-Host "  7)  清理未使用的依赖"
        Write-ColorText "─────────────────────────────────────────────────────────────" "Gray"
        Write-ColorText "  0)  返回主菜单" "Red"
        Write-Host ""
        $choice = Read-Host "请选择 (0-7)"
        
        switch ($choice) {
            "1" { Install-NpmFast }
            "2" { Install-PnpmFast }
            "3" { Install-Pnpm }
            "4" { Check-Vulnerabilities }
            "5" { Update-Dependencies }
            "6" { Analyze-BundleSize }
            "7" { Clean-UnusedDeps }
            "0" { break }
            default { 
                Write-ColorText "❌ 无效选择，请重试" "Red"
                Start-Sleep -Seconds 2
            }
        }
    } while ($choice -ne "0")
}

# 实现功能函数 (部分示例)

# 安装 NVM for Windows
function Install-NVM {
    Write-ColorText "📥 安装 NVM for Windows..." "Blue"
    if (Test-Command "nvm") {
        Write-ColorText "⚠️  NVM 已安装" "Yellow"
    } else {
        Write-ColorText "请访问 https://github.com/coreybutler/nvm-windows/releases 下载安装" "Cyan"
        Write-ColorText "或者使用 Chocolatey: choco install nvm" "Cyan"
    }
    Read-Host "按任意键继续..."
}

# 安装推荐 Node.js 版本
function Install-RecommendedNode {
    Write-ColorText "📥 安装推荐 Node.js 版本 $RECOMMENDED_NODE..." "Blue"
    if (Test-Command "nvm") {
        nvm install $RECOMMENDED_NODE
        nvm use $RECOMMENDED_NODE
        Write-ColorText "✅ Node.js $RECOMMENDED_NODE 安装并切换成功" "Green"
    } else {
        Write-ColorText "❌ 请先安装 NVM" "Red"
    }
    Read-Host "按任意键继续..."
}

# 配置淘宝镜像
function Setup-TaobaoMirror {
    Write-ColorText "🚀 配置淘宝镜像..." "Blue"
    npm config set registry https://registry.npmmirror.com
    npm config set "@vue:registry" https://registry.npmmirror.com
    npm config set "@vite:registry" https://registry.npmmirror.com
    npm config set "@element-plus:registry" https://registry.npmmirror.com
    npm config set "@types:registry" https://registry.npmmirror.com
    Write-ColorText "✅ 淘宝镜像配置完成" "Green"
    Read-Host "按任意键继续..."
}

# npm 快速安装
function Install-NpmFast {
    Write-ColorText "📦 NPM 快速安装依赖..." "Blue"
    npm install --registry=https://registry.npmmirror.com
    Read-Host "按任意键继续..."
}

# pnpm 快速安装
function Install-PnpmFast {
    Write-ColorText "📦 PNPM 快速安装依赖..." "Blue"
    if (Test-Command "pnpm") {
        pnpm install --registry=https://registry.npmmirror.com
    } else {
        Write-ColorText "❌ 请先安装 PNPM" "Red"
    }
    Read-Host "按任意键继续..."
}

# 主程序
function Main {
    # 检查是否在项目根目录
    if (-not (Test-Path "package.json")) {
        Write-ColorText "❌ 请在项目根目录下运行此脚本" "Red"
        exit 1
    }
    
    do {
        Show-Header
        Show-Environment
        Show-MainMenu
        $choice = Read-Host "请选择功能 (0-8)"
        
        switch ($choice) {
            "1" { Show-NodejsManagementMenu }
            "2" { Show-MirrorManagementMenu }
            "3" { Show-DependencyManagementMenu }
            "4" { # 项目启动与构建菜单
                Write-ColorText "🚀 功能开发中..." "Yellow"
                Read-Host "按任意键继续..."
            }
            "5" { # 代码质量检查菜单
                Write-ColorText "🔍 功能开发中..." "Yellow"
                Read-Host "按任意键继续..."
            }
            "6" { # 环境诊断菜单
                Write-ColorText "🔧 功能开发中..." "Yellow"
                Read-Host "按任意键继续..."
            }
            "7" { # 缓存清理菜单
                Write-ColorText "🗑️ 功能开发中..." "Yellow"
                Read-Host "按任意键继续..."
            }
            "8" { # 项目信息菜单
                Write-ColorText "ℹ️  功能开发中..." "Yellow"
                Read-Host "按任意键继续..."
            }
            "0" { 
                Write-ColorText "👋 感谢使用 MMS-UI 开发工具菜单！" "Green"
                exit 0
            }
            default { 
                Write-ColorText "❌ 无效选择，请重试" "Red"
                Start-Sleep -Seconds 2
            }
        }
    } while ($choice -ne "0")
}

# 启动主程序
Main