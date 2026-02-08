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

# 安装 NVM for Windows (增强版)
function Install-NVM {
    Write-ColorText "📥 安装 NVM for Windows..." "Blue"
    Write-ColorText "─────────────────────────────────────────────────────────────" "Gray"
    
    # 检查是否已经安装
    if (Test-Command "nvm") {
        try {
            $currentVersion = nvm version
            Write-ColorText "  ⚠️  NVM 已安装: $currentVersion" "Yellow"
            Write-Host ""
            $reinstallChoice = Read-Host "是否要重新安装最新版本? (y/n)"
            if ($reinstallChoice -ne "y" -and $reinstallChoice -ne "Y") {
                Write-ColorText "💡 保持当前安装 $currentVersion" "Cyan"
                Read-Host "按任意键继续..."
                return
            }
        } catch {
            Write-ColorText "  ⚠️  NVM 存在但未正确配置" "Yellow"
        }
    }
    
    Write-ColorText "📋 NVM for Windows 安装方式选择:" "Cyan"
    Write-Host "  1) 使用 Chocolatey 安装 (推荐)"
    Write-Host "  2) 使用 Scoop 安装"
    Write-Host "  3) 手动下载安装包"
    Write-Host "  4) 使用 winget 安装"
    Write-Host ""
    $installChoice = Read-Host "请选择安装方式 (1-4)"
    
    # 获取最新版本
    Write-ColorText "🔍 获取 NVM for Windows 最新版本信息..." "Blue"
    try {
        $apiResponse = Invoke-WebRequest -Uri "https://api.github.com/repos/coreybutler/nvm-windows/releases/latest" -UseBasicParsing
        $releaseInfo = $apiResponse.Content | ConvertFrom-Json
        $latestVersion = $releaseInfo.tag_name
        Write-ColorText "最新版本: $latestVersion" "Cyan"
    } catch {
        $latestVersion = "v1.1.12"
        Write-ColorText "无法获取最新版本，使用默认版本: $latestVersion" "Yellow"
    }
    Write-Host ""
    
    switch ($installChoice) {
        "1" {
            Write-ColorText "📥 使用 Chocolatey 安装 NVM for Windows..." "Blue"
            if (Test-Command "choco") {
                # 卸载旧版本
                if (Test-Command "nvm") {
                    Write-ColorText "🗑️ 卸载旧版本..." "Yellow"
                    choco uninstall nvm -y 2>$null
                }
                
                # 安装新版本
                choco install nvm -y
                if ($LASTEXITCODE -eq 0) {
                    Write-ColorText "✅ NVM for Windows 安装成功" "Green"
                    # 刷新环境变量
                    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
                } else {
                    Write-ColorText "❌ NVM for Windows 安装失败" "Red"
                }
            } else {
                Write-ColorText "❌ Chocolatey 未安装，请先安装 Chocolatey" "Red"
                Write-ColorText "💡 Chocolatey 安装命令:" "Cyan"
                Write-Host "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"
            }
        }
        "2" {
            Write-ColorText "📥 使用 Scoop 安装 NVM for Windows..." "Blue"
            if (Test-Command "scoop") {
                # 卸载旧版本
                if (Test-Command "nvm") {
                    Write-ColorText "🗑️ 卸载旧版本..." "Yellow"
                    scoop uninstall nvm 2>$null
                }
                
                # 添加 extras bucket 如果未添加
                scoop bucket add extras 2>$null
                
                # 安装新版本
                scoop install nvm
                if ($LASTEXITCODE -eq 0) {
                    Write-ColorText "✅ NVM for Windows 安装成功" "Green"
                } else {
                    Write-ColorText "❌ NVM for Windows 安装失败" "Red"
                }
            } else {
                Write-ColorText "❌ Scoop 未安装，请先安装 Scoop" "Red"
                Write-ColorText "💡 Scoop 安装命令:" "Cyan"
                Write-Host "Set-ExecutionPolicy RemoteSigned -Scope CurrentUser; irm get.scoop.sh | iex"
            }
        }
        "3" {
            Write-ColorText "📁 手动下载安装指引:" "Blue"
            Write-ColorText "1. 访问 NVM for Windows GitHub 页面:" "Cyan"
            Write-Host "   https://github.com/coreybutler/nvm-windows/releases"
            Write-ColorText "2. 下载最新版本: $latestVersion" "Cyan"
            Write-ColorText "3. 选择 nvm-setup.zip 或 nvm-setup.exe" "Cyan"
            Write-ColorText "4. 解压并运行安装程序" "Cyan"
            Write-ColorText "5. 按照安装向导完成安装" "Cyan"
            
            # 提供直接下载链接
            if ($releaseInfo) {
                $setupAsset = $releaseInfo.assets | Where-Object { $_.name -like "*setup*" } | Select-Object -First 1
                if ($setupAsset) {
                    Write-ColorText "🔗 直接下载链接:" "Cyan"
                    Write-Host "   $($setupAsset.browser_download_url)"
                }
            }
        }
        "4" {
            Write-ColorText "📥 使用 winget 安装 NVM for Windows..." "Blue"
            if (Test-Command "winget") {
                winget install CoreyButler.NVMforWindows
                if ($LASTEXITCODE -eq 0) {
                    Write-ColorText "✅ NVM for Windows 安装成功" "Green"
                    # 刷新环境变量
                    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
                } else {
                    Write-ColorText "❌ NVM for Windows 安装失败" "Red"
                }
            } else {
                Write-ColorText "❌ winget 未安装或不可用" "Red"
                Write-ColorText "💡 winget 是 Windows 10/11 的包管理器，请确保系统已更新" "Cyan"
            }
        }
        default {
            Write-ColorText "❌ 无效选择" "Red"
            Read-Host "按任意键继续..."
            return
        }
    }
    
    Write-Host ""
    Write-ColorText "📋 NVM for Windows 验证:" "Cyan"
    
    # 刷新环境变量
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    
    if (Test-Command "nvm") {
        try {
            $nvmVersion = nvm version
            Write-ColorText "  ✅ NVM 版本: $nvmVersion" "Green"
            
            # 检查安装路径
            $nvmPath = Get-Command nvm -ErrorAction SilentlyContinue
            if ($nvmPath) {
                Write-ColorText "  ✅ 安装路径: $($nvmPath.Path)" "Green"
            }
            
            # 显示可用的 Node.js 版本
            Write-ColorText "  ✅ 正在检查可用的 Node.js 版本..." "Green"
            try {
                $nodeVersions = nvm list available 2>$null | Select-Object -First 10
                if ($nodeVersions) {
                    $nodeVersions | ForEach-Object { Write-Host "    $_" }
                } else {
                    Write-Host "    无法获取远程版本列表"
                }
            } catch {
                Write-Host "    无法获取远程版本列表"
            }
            
            Write-Host ""
            Write-ColorText "💡 常用 NVM 命令:" "Cyan"
            Write-Host "  nvm install latest      - 安装最新版本 Node.js"
            Write-Host "  nvm install lts          - 安装最新 LTS 版本"
            Write-Host "  nvm use <version>        - 使用指定版本"
            Write-Host "  nvm list                 - 查看已安装版本"
            Write-Host "  nvm list available       - 查看可用版本"
            
            Write-Host ""
            Write-ColorText "✅ NVM for Windows 安装完成！" "Green"
            Write-ColorText "⚠️  请重新打开 PowerShell 终端以加载 NVM" "Yellow"
        } catch {
            Write-ColorText "  ❌ NVM 验证失败" "Red"
            Write-ColorText "  ⚠️  可能需要重启终端或重新登录" "Yellow"
        }
    } else {
        Write-ColorText "  ❌ NVM 验证失败" "Red"
        Write-ColorText "  ⚠️  请检查安装是否成功，可能需要重启系统" "Yellow"
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

# 安装 PNPM (增强版)
function Install-Pnpm {
    Write-ColorText "📥 安装 PNPM..." "Blue"
    Write-ColorText "─────────────────────────────────────────────────────────────" "Gray"
    
    # 检查是否已经安装
    if (Test-Command "pnpm") {
        $currentVersion = pnpm --version
        Write-ColorText "  ⚠️  PNPM 已安装: v$currentVersion" "Yellow"
        Write-Host ""
        $upgradeChoice = Read-Host "是否要升级到最新版本? (y/n)"
        if ($upgradeChoice -eq "y" -or $upgradeChoice -eq "Y") {
            Write-ColorText "🔄 升级 PNPM 到最新版本..." "Blue"
            npm install -g pnpm@latest
            if ($LASTEXITCODE -eq 0) {
                $newVersion = pnpm --version
                Write-ColorText "✅ PNPM 升级成功: v$currentVersion → v$newVersion" "Green"
            } else {
                Write-ColorText "❌ PNPM 升级失败" "Red"
            }
        } else {
            Write-ColorText "💡 保持当前版本 v$currentVersion" "Cyan"
        }
    } else {
        Write-ColorText "📋 PNPM 安装方式选择:" "Cyan"
        Write-Host "  1) 使用 npm 安装 (推荐)"
        Write-Host "  2) 使用 PowerShell 安装脚本"
        Write-Host "  3) 使用 Chocolatey 安装"
        Write-Host "  4) 使用 Scoop 安装"
        Write-Host ""
        $installChoice = Read-Host "请选择安装方式 (1-4)"
        
        switch ($installChoice) {
            "1" {
                Write-ColorText "📥 使用 npm 安装 PNPM..." "Blue"
                npm install -g pnpm
                if ($LASTEXITCODE -eq 0) {
                    $installedVersion = pnpm --version
                    Write-ColorText "✅ PNPM 安装成功: v$installedVersion" "Green"
                    Write-ColorText "🔧 自动配置镜像源..." "Cyan"
                    pnpm config set registry https://registry.npmmirror.com
                    Write-ColorText "✅ 镜像源配置完成" "Green"
                } else {
                    Write-ColorText "❌ PNPM 安装失败" "Red"
                }
            }
            "2" {
                Write-ColorText "📥 使用安装脚本安装 PNPM..." "Blue"
                try {
                    Invoke-WebRequest https://get.pnpm.io/install.ps1 -OutFile install-pnpm.ps1
                    PowerShell -ExecutionPolicy Bypass -File install-pnpm.ps1
                    Remove-Item install-pnpm.ps1 -Force
                    # 刷新环境变量
                    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
                    if (Test-Command "pnpm") {
                        $installedVersion = pnpm --version
                        Write-ColorText "✅ PNPM 安装成功: v$installedVersion" "Green"
                        Write-ColorText "🔧 自动配置镜像源..." "Cyan"
                        pnpm config set registry https://registry.npmmirror.com
                        Write-ColorText "✅ 镜像源配置完成" "Green"
                    } else {
                        Write-ColorText "❌ PNPM 安装失败，请重启终端或手动配置环境变量" "Red"
                    }
                } catch {
                    Write-ColorText "❌ 下载安装脚本失败" "Red"
                }
            }
            "3" {
                Write-ColorText "📥 使用 Chocolatey 安装 PNPM..." "Blue"
                if (Test-Command "choco") {
                    choco install pnpm -y
                    if ($LASTEXITCODE -eq 0) {
                        $installedVersion = pnpm --version
                        Write-ColorText "✅ PNPM 安装成功: v$installedVersion" "Green"
                        Write-ColorText "🔧 自动配置镜像源..." "Cyan"
                        pnpm config set registry https://registry.npmmirror.com
                        Write-ColorText "✅ 镜像源配置完成" "Green"
                    } else {
                        Write-ColorText "❌ PNPM 安装失败" "Red"
                    }
                } else {
                    Write-ColorText "❌ Chocolatey 未安装，请先安装 Chocolatey" "Red"
                    Write-ColorText "💡 Chocolatey 安装命令: Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))" "Cyan"
                }
            }
            "4" {
                Write-ColorText "📥 使用 Scoop 安装 PNPM..." "Blue"
                if (Test-Command "scoop") {
                    scoop install pnpm
                    if ($LASTEXITCODE -eq 0) {
                        $installedVersion = pnpm --version
                        Write-ColorText "✅ PNPM 安装成功: v$installedVersion" "Green"
                        Write-ColorText "🔧 自动配置镜像源..." "Cyan"
                        pnpm config set registry https://registry.npmmirror.com
                        Write-ColorText "✅ 镜像源配置完成" "Green"
                    } else {
                        Write-ColorText "❌ PNPM 安装失败" "Red"
                    }
                } else {
                    Write-ColorText "❌ Scoop 未安装，请先安装 Scoop" "Red"
                    Write-ColorText "💡 Scoop 安装命令: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser; irm get.scoop.sh | iex" "Cyan"
                }
            }
            default {
                Write-ColorText "❌ 无效选择" "Red"
            }
        }
    }
    
    Write-Host ""
    Write-ColorText "📋 PNPM 验证:" "Cyan"
    if (Test-Command "pnpm") {
        Write-ColorText "  ✅ PNPM 版本: $(pnpm --version)" "Green"
        Write-ColorText "  ✅ 安装路径: $(Get-Command pnpm | Select-Object -ExpandProperty Path)" "Green"
        Write-ColorText "  ✅ 镜像源: $(pnpm config get registry)" "Green"
        Write-Host ""
        Write-ColorText "💡 常用 PNPM 命令:" "Cyan"
        Write-Host "  pnpm install          - 安装依赖"
        Write-Host "  pnpm add <package>     - 添加依赖"
        Write-Host "  pnpm run dev           - 运行开发服务器"
        Write-Host "  pnpm store prune       - 清理存储"
    } else {
        Write-ColorText "  ❌ PNPM 验证失败" "Red"
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