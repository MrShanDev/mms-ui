# ============================================================================
# MMS-UI PNPM 一键启动脚本 (PowerShell 版本)
# 基于 Vue3 + TypeScript + Vite 项目的快速启动工具
# ============================================================================

# 设置控制台编码为 UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 项目信息
$PROJECT_NAME = "mms-ui"
$PROJECT_VERSION = if (Test-Path "package.json") { 
    (Get-Content "package.json" | ConvertFrom-Json).version 
} else { "Unknown" }
$NODE_MIN_VERSION = "18.0.0"
$PNPM_MIN_VERSION = "8.0.0"

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

# 版本比较函数
function Compare-Version {
    param([string]$Version1, [string]$Version2)
    
    try {
        $v1 = [Version]::Parse($Version1)
        $v2 = [Version]::Parse($Version2)
        return $v1 -le $v2
    } catch {
        return $false
    }
}

# 显示标题
function Show-Header {
    Clear-Host
    Write-ColorText "╔══════════════════════════════════════════════════════════╗" "Cyan"
    Write-ColorText "║               MMS-UI PNPM 一键启动脚本                  ║" "White"
    Write-ColorText "╠══════════════════════════════════════════════════════════╣" "Cyan"
    Write-ColorText "║ 项目版本: $PROJECT_VERSION                                    ║" "Yellow"
    Write-ColorText "║ 技 术 栈: Vue3 + TypeScript + Vite + PNPM               ║" "Yellow"
    Write-ColorText "╚══════════════════════════════════════════════════════════╝" "Cyan"
    Write-Host ""
}

# 环境检查
function Test-Environment {
    Write-ColorText "🔍 环境检查..." "Blue"
    Write-ColorText "─────────────────────────────────────────────────────────────" "Gray"
    
    $allChecksPassed = $true
    
    # 检查 Node.js
    if (Test-Command "node") {
        $nodeVersion = (node --version).TrimStart('v')
        Write-ColorText "  ✅ Node.js: v$nodeVersion" "Green"
        
        if (-not (Compare-Version $NODE_MIN_VERSION $nodeVersion)) {
            Write-ColorText "    ❌ 版本过低，最低要求: v$NODE_MIN_VERSION" "Red"
            $allChecksPassed = $false
        }
    } else {
        Write-ColorText "  ❌ Node.js: 未安装" "Red"
        $allChecksPassed = $false
    }
    
    # 检查 npm
    if (Test-Command "npm") {
        $npmVersion = npm --version
        Write-ColorText "  ✅ npm: v$npmVersion" "Green"
    } else {
        Write-ColorText "  ❌ npm: 未安装" "Red"
        $allChecksPassed = $false
    }
    
    # 检查 pnpm
    if (Test-Command "pnpm") {
        $pnpmVersion = pnpm --version
        Write-ColorText "  ✅ pnpm: v$pnpmVersion" "Green"
        
        if (-not (Compare-Version $PNPM_MIN_VERSION $pnpmVersion)) {
            Write-ColorText "    ⚠️  建议升级到 v$PNPM_MIN_VERSION+" "Yellow"
        }
    } else {
        Write-ColorText "  ⚠️  pnpm: 未安装" "Yellow"
        Write-ColorText "    💡 将自动安装 pnpm" "Cyan"
    }
    
    # 检查项目文件
    if (Test-Path "package.json") {
        Write-ColorText "  ✅ package.json: 存在" "Green"
    } else {
        Write-ColorText "  ❌ package.json: 不存在" "Red"
        $allChecksPassed = $false
    }
    
    # 检查依赖
    if (Test-Path "node_modules") {
        Write-ColorText "  ✅ node_modules: 存在" "Green"
    } else {
        Write-ColorText "  ⚠️  node_modules: 不存在，需要安装依赖" "Yellow"
    }
    
    # 检查 pnpm-lock.yaml
    if (Test-Path "pnpm-lock.yaml") {
        Write-ColorText "  ✅ pnpm-lock.yaml: 存在" "Green"
    } else {
        Write-ColorText "  ⚠️  pnpm-lock.yaml: 不存在" "Yellow"
    }
    
    Write-Host ""
    return $allChecksPassed
}

# 安装 pnpm
function Install-Pnpm {
    Write-ColorText "📥 安装 pnpm..." "Blue"
    
    if (Test-Command "npm") {
        npm install -g pnpm
        if ($LASTEXITCODE -eq 0) {
            Write-ColorText "✅ pnpm 安装成功" "Green"
            # 配置镜像源
            pnpm config set registry https://registry.npmmirror.com
            Write-ColorText "✅ 镜像源配置完成" "Green"
        } else {
            Write-ColorText "❌ pnpm 安装失败" "Red"
            exit 1
        }
    } else {
        Write-ColorText "❌ npm 未安装，无法自动安装 pnpm" "Red"
        exit 1
    }
}

# 配置镜像源
function Set-Mirrors {
    Write-ColorText "🔧 配置镜像源..." "Blue"
    
    # 配置 npm 镜像
    if (Test-Command "npm") {
        npm config set registry https://registry.npmmirror.com
        Write-ColorText "  ✅ npm 镜像源已配置" "Green"
    }
    
    # 配置 pnpm 镜像
    if (Test-Command "pnpm") {
        pnpm config set registry https://registry.npmmirror.com
        Write-ColorText "  ✅ pnpm 镜像源已配置" "Green"
    }
}

# 安装依赖
function Install-Dependencies {
    Write-ColorText "📦 安装项目依赖..." "Blue"
    
    if (Test-Command "pnpm") {
        pnpm install
        if ($LASTEXITCODE -eq 0) {
            Write-ColorText "✅ 依赖安装完成" "Green"
        } else {
            Write-ColorText "❌ 依赖安装失败" "Red"
            exit 1
        }
    } else {
        Write-ColorText "❌ pnpm 未安装" "Red"
        exit 1
    }
}

# 显示启动选项
function Show-StartOptions {
    Write-ColorText "🚀 启动选项:" "Magenta"
    Write-ColorText "─────────────────────────────────────────────────────────────" "Gray"
    Write-Host "  1)  开发模式启动 (推荐)"
    Write-Host "  2)  生产模式构建"
    Write-Host "  3)  预览构建结果"
    Write-Host "  4)  类型检查"
    Write-Host "  5)  代码格式化"
    Write-Host "  6)  代码质量检查"
    Write-Host "  7)  清理缓存和依赖"
    Write-ColorText "─────────────────────────────────────────────────────────────" "Gray"
    Write-ColorText "  0)  退出" "Red"
    Write-Host ""
}

# 显示清理选项
function Show-CleanOptions {
    Write-ColorText "🗑️ 清理选项:" "Magenta"
    Write-ColorText "─────────────────────────────────────────────────────────────" "Gray"
    Write-Host "  1)  清理 pnpm 缓存"
    Write-Host "  2)  删除 node_modules"
    Write-Host "  3)  删除 pnpm-lock.yaml"
    Write-Host "  4)  完全清理 (缓存 + 依赖 + lock文件)"
    Write-ColorText "─────────────────────────────────────────────────────────────" "Gray"
    Write-ColorText "  0)  返回主菜单" "Red"
    Write-Host ""
}

# 执行清理
function Invoke-Clean {
    param([string]$Choice)
    
    switch ($Choice) {
        "1" {
            Write-ColorText "🗑️ 清理 pnpm 缓存..." "Blue"
            pnpm store prune
            Write-ColorText "✅ pnpm 缓存清理完成" "Green"
        }
        "2" {
            Write-ColorText "🗑️ 删除 node_modules..." "Blue"
            if (Test-Path "node_modules") {
                Remove-Item -Recurse -Force "node_modules"
            }
            Write-ColorText "✅ node_modules 删除完成" "Green"
        }
        "3" {
            Write-ColorText "🗑️ 删除 pnpm-lock.yaml..." "Blue"
            if (Test-Path "pnpm-lock.yaml") {
                Remove-Item "pnpm-lock.yaml"
            }
            Write-ColorText "✅ pnpm-lock.yaml 删除完成" "Green"
        }
        "4" {
            Write-ColorText "🗑️ 完全清理..." "Blue"
            if (Test-Command "pnpm") { pnpm store prune 2>$null }
            if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
            if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
            if (Test-Path "pnpm-lock.yaml") { Remove-Item "pnpm-lock.yaml" }
            Write-ColorText "✅ 完全清理完成" "Green"
        }
        "0" {
            return
        }
        default {
            Write-ColorText "❌ 无效选择" "Red"
        }
    }
    
    if ($Choice -ne "0") {
        Read-Host "按任意键继续..."
    }
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
        
        # 环境检查
        if (-not (Test-Environment)) {
            Write-ColorText "❌ 环境检查失败，请先解决上述问题" "Red"
            
            # 询问是否自动安装 pnpm
            if (-not (Test-Command "pnpm")) {
                $installChoice = Read-Host "是否自动安装 pnpm? (y/n)"
                if ($installChoice -eq "y" -or $installChoice -eq "Y") {
                    Install-Pnpm
                    continue
                } else {
                    exit 1
                }
            } else {
                exit 1
            }
        }
        
        # 配置镜像源
        Set-Mirrors
        
        # 检查依赖
        if (-not (Test-Path "node_modules")) {
            $installDeps = Read-Host "⚠️  依赖未安装，是否现在安装? (y/n)"
            if ($installDeps -eq "y" -or $installDeps -eq "Y") {
                Install-Dependencies
            }
        }
        
        Write-Host ""
        Show-StartOptions
        $choice = Read-Host "请选择操作 (0-7)"
        
        switch ($choice) {
            "1" {
                Write-ColorText "🚀 启动开发服务器..." "Green"
                pnpm run dev
            }
            "2" {
                Write-ColorText "🏗️ 构建生产版本..." "Green"
                pnpm run build
                Write-ColorText "✅ 构建完成" "Green"
                Read-Host "按任意键继续..."
            }
            "3" {
                Write-ColorText "👀 预览构建结果..." "Green"
                pnpm run preview
            }
            "4" {
                Write-ColorText "🔍 TypeScript 类型检查..." "Green"
                pnpm run type-check
                Write-ColorText "✅ 类型检查完成" "Green"
                Read-Host "按任意键继续..."
            }
            "5" {
                Write-ColorText "💄 代码格式化..." "Green"
                pnpm run format
                Write-ColorText "✅ 格式化完成" "Green"
                Read-Host "按任意键继续..."
            }
            "6" {
                Write-ColorText "🔍 代码质量检查..." "Green"
                pnpm run lint
                Write-ColorText "✅ 质量检查完成" "Green"
                Read-Host "按任意键继续..."
            }
            "7" {
                do {
                    Show-Header
                    Show-CleanOptions
                    $cleanChoice = Read-Host "请选择清理操作 (0-4)"
                    
                    if ($cleanChoice -eq "0") {
                        break
                    } else {
                        Invoke-Clean $cleanChoice
                    }
                } while ($cleanChoice -ne "0")
            }
            "0" {
                Write-ColorText "👋 感谢使用 MMS-UI PNPM 一键启动脚本！" "Green"
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