#!/bin/bash

# ============================================================================
# MMS-UI 综合开发工具菜单
# 基于 Vue3 + TypeScript + Vite 项目的完整开发环境管理工具
# ============================================================================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# 项目信息
PROJECT_NAME="mms-ui"
PROJECT_VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "Unknown")
NODE_MIN_VERSION="18.0.0"
RECOMMENDED_NODE="20.19.5"

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 显示标题
show_header() {
    clear
    echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${WHITE}               MMS-UI 综合开发工具菜单                    ${CYAN}║${NC}"
    echo -e "${CYAN}╠══════════════════════════════════════════════════════════╣${NC}"
    echo -e "${CYAN}║ ${YELLOW}项目版本:${NC} ${PROJECT_VERSION}${CYAN}                                          ║${NC}"
    echo -e "${CYAN}║ ${YELLOW}技 术 栈:${NC} Vue3 + TypeScript + Vite                       ${CYAN}║${NC}"
    echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# 显示环境信息
show_environment() {
    echo -e "${BLUE}📋 当前环境信息:${NC}"
    echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
    
    # Node.js 版本
    if command_exists node; then
        NODE_VERSION=$(node --version)
        echo -e "  ${GREEN}✅ Node.js:${NC} ${NODE_VERSION}"
    else
        echo -e "  ${RED}❌ Node.js:${NC} 未安装"
    fi
    
    # npm 版本
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        echo -e "  ${GREEN}✅ npm:${NC} v${NPM_VERSION}"
    else
        echo -e "  ${RED}❌ npm:${NC} 未安装"
    fi
    
    # pnpm 版本
    if command_exists pnpm; then
        PNPM_VERSION=$(pnpm --version)
        echo -e "  ${GREEN}✅ pnpm:${NC} v${PNPM_VERSION}"
    else
        echo -e "  ${YELLOW}⚠️  pnpm:${NC} 未安装"
    fi
    
    # nvm 版本
    if command_exists nvm; then
        NVM_VERSION=$(nvm --version 2>/dev/null)
        echo -e "  ${GREEN}✅ nvm:${NC} v${NVM_VERSION}"
    elif [[ -s "$NVM_DIR/nvm.sh" ]]; then
        source "$NVM_DIR/nvm.sh"
        if command_exists nvm; then
            NVM_VERSION=$(nvm --version 2>/dev/null)
            echo -e "  ${GREEN}✅ nvm:${NC} v${NVM_VERSION}"
        fi
    else
        echo -e "  ${YELLOW}⚠️  nvm:${NC} 未安装"
    fi
    
    # 当前镜像源
    if command_exists npm; then
        REGISTRY=$(npm config get registry)
        if [[ "$REGISTRY" == *"npmmirror.com"* ]]; then
            echo -e "  ${GREEN}✅ 镜像源:${NC} 淘宝镜像 (${REGISTRY})"
        else
            echo -e "  ${YELLOW}⚠️  镜像源:${NC} ${REGISTRY}"
        fi
    fi
    
    echo ""
}

# 显示主菜单
show_main_menu() {
    echo -e "${PURPLE}🚀 请选择功能:${NC}"
    echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
    echo -e "  ${CYAN}1)${NC}  Node.js 环境管理 (NVM)"
    echo -e "  ${CYAN}2)${NC}  镜像源配置与加速"
    echo -e "  ${CYAN}3)${NC}  依赖安装与管理"
    echo -e "  ${CYAN}4)${NC}  项目启动与构建"
    echo -e "  ${CYAN}5)${NC}  代码质量检查与修复"
    echo -e "  ${CYAN}6)${NC}  环境诊断与优化"
    echo -e "  ${CYAN}7)${NC}  缓存清理与重置"
    echo -e "  ${CYAN}8)${NC}  项目信息与帮助"
    echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
    echo -e "  ${RED}0)${NC}  退出"
    echo ""
}

# Node.js 环境管理菜单
nodejs_management_menu() {
    while true; do
        show_header
        show_environment
        echo -e "${PURPLE}🔧 Node.js 环境管理 (NVM):${NC}"
        echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
        echo -e "  ${CYAN}1)${NC}  安装 NVM"
        echo -e "  ${CYAN}2)${NC}  安装推荐 Node.js 版本 (${RECOMMENDED_NODE})"
        echo -e "  ${CYAN}3)${NC}  安装最新 LTS Node.js"
        echo -e "  ${CYAN}4)${NC}  切换 Node.js 版本"
        echo -e "  ${CYAN}5)${NC}  查看已安装的 Node.js 版本"
        echo -e "  ${CYAN}6)${NC}  设置默认 Node.js 版本"
        echo -e "  ${CYAN}7)${NC}  升级 npm 到最新版本"
        echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
        echo -e "  ${RED}0)${NC}  返回主菜单"
        echo ""
        read -p "请选择 (0-7): " choice
        
        case $choice in
            1) install_nvm ;;
            2) install_recommended_node ;;
            3) install_latest_lts_node ;;
            4) switch_node_version ;;
            5) list_node_versions ;;
            6) set_default_node ;;
            7) upgrade_npm ;;
            0) break ;;
            *) echo -e "${RED}❌ 无效选择，请重试${NC}" && sleep 2 ;;
        esac
    done
}

# 镜像源配置菜单
mirror_management_menu() {
    while true; do
        show_header
        show_environment
        echo -e "${PURPLE}🌐 镜像源配置与加速:${NC}"
        echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
        echo -e "  ${CYAN}1)${NC}  一键配置淘宝镜像 (推荐)"
        echo -e "  ${CYAN}2)${NC}  验证镜像配置"
        echo -e "  ${CYAN}3)${NC}  测试镜像速度"
        echo -e "  ${CYAN}4)${NC}  切换到官方镜像"
        echo -e "  ${CYAN}5)${NC}  配置 PNPM 镜像"
        echo -e "  ${CYAN}6)${NC}  显示当前镜像配置"
        echo -e "  ${CYAN}7)${NC}  镜像源对比测试"
        echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
        echo -e "  ${RED}0)${NC}  返回主菜单"
        echo ""
        read -p "请选择 (0-7): " choice
        
        case $choice in
            1) setup_taobao_mirror ;;
            2) verify_mirrors ;;
            3) test_mirror_speed ;;
            4) switch_to_official ;;
            5) setup_pnpm_mirror ;;
            6) show_current_mirrors ;;
            7) compare_mirrors ;;
            0) break ;;
            *) echo -e "${RED}❌ 无效选择，请重试${NC}" && sleep 2 ;;
        esac
    done
}

# 依赖安装与管理菜单
dependency_management_menu() {
    while true; do
        show_header
        show_environment
        echo -e "${PURPLE}📦 依赖安装与管理:${NC}"
        echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
        echo -e "  ${CYAN}1)${NC}  NPM 快速安装依赖"
        echo -e "  ${CYAN}2)${NC}  PNPM 快速安装依赖"
        echo -e "  ${CYAN}3)${NC}  安装 PNPM (如果未安装)"
        echo -e "  ${CYAN}4)${NC}  检查依赖安全漏洞"
        echo -e "  ${CYAN}5)${NC}  更新依赖到最新版本"
        echo -e "  ${CYAN}6)${NC}  分析依赖包大小"
        echo -e "  ${CYAN}7)${NC}  清理未使用的依赖"
        echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
        echo -e "  ${RED}0)${NC}  返回主菜单"
        echo ""
        read -p "请选择 (0-7): " choice
        
        case $choice in
            1) npm_install_fast ;;
            2) pnpm_install_fast ;;
            3) install_pnpm ;;
            4) check_vulnerabilities ;;
            5) update_dependencies ;;
            6) analyze_bundle_size ;;
            7) clean_unused_deps ;;
            0) break ;;
            *) echo -e "${RED}❌ 无效选择，请重试${NC}" && sleep 2 ;;
        esac
    done
}

# 项目启动与构建菜单
project_build_menu() {
    while true; do
        show_header
        show_environment
        echo -e "${PURPLE}🚀 项目启动与构建:${NC}"
        echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
        echo -e "  ${CYAN}1)${NC}  启动开发服务器 (npm)"
        echo -e "  ${CYAN}2)${NC}  启动开发服务器 (pnpm)"
        echo -e "  ${CYAN}3)${NC}  一键启动脚本 (推荐)"
        echo -e "  ${CYAN}4)${NC}  构建生产版本"
        echo -e "  ${CYAN}5)${NC}  预览构建结果"
        echo -e "  ${CYAN}6)${NC}  开发环境构建"
        echo -e "  ${CYAN}7)${NC}  TypeScript 类型检查"
        echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
        echo -e "  ${RED}0)${NC}  返回主菜单"
        echo ""
        read -p "请选择 (0-7): " choice
        
        case $choice in
            1) start_dev_npm ;;
            2) start_dev_pnpm ;;
            3) start_with_script ;;
            4) build_production ;;
            5) preview_build ;;
            6) build_development ;;
            7) type_check ;;
            0) break ;;
            *) echo -e "${RED}❌ 无效选择，请重试${NC}" && sleep 2 ;;
        esac
    done
}

# 代码质量检查菜单
code_quality_menu() {
    while true; do
        show_header
        show_environment
        echo -e "${PURPLE}🔍 代码质量检查与修复:${NC}"
        echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
        echo -e "  ${CYAN}1)${NC}  ESLint 代码检查"
        echo -e "  ${CYAN}2)${NC}  ESLint 自动修复"
        echo -e "  ${CYAN}3)${NC}  Prettier 代码格式化"
        echo -e "  ${CYAN}4)${NC}  Prettier 格式化检查"
        echo -e "  ${CYAN}5)${NC}  组合检查 (Lint + Format)"
        echo -e "  ${CYAN}6)${NC}  Git 提交前检查"
        echo -e "  ${CYAN}7)${NC}  批量格式化 Vue 文件"
        echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
        echo -e "  ${RED}0)${NC}  返回主菜单"
        echo ""
        read -p "请选择 (0-7): " choice
        
        case $choice in
            1) run_eslint ;;
            2) run_eslint_fix ;;
            3) run_prettier ;;
            4) run_prettier_check ;;
            5) run_combined_check ;;
            6) run_pre_commit_check ;;
            7) batch_format_vue ;;
            0) break ;;
            *) echo -e "${RED}❌ 无效选择，请重试${NC}" && sleep 2 ;;
        esac
    done
}

# 环境诊断菜单
environment_diagnosis_menu() {
    while true; do
        show_header
        show_environment
        echo -e "${PURPLE}🔧 环境诊断与优化:${NC}"
        echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
        echo -e "  ${CYAN}1)${NC}  完整环境检查"
        echo -e "  ${CYAN}2)${NC}  网络连接诊断"
        echo -e "  ${CYAN}3)${NC}  端口占用检查"
        echo -e "  ${CYAN}4)${NC}  磁盘空间检查"
        echo -e "  ${CYAN}5)${NC}  权限问题诊断"
        echo -e "  ${CYAN}6)${NC}  生成诊断报告"
        echo -e "  ${CYAN}7)${NC}  性能优化建议"
        echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
        echo -e "  ${RED}0)${NC}  返回主菜单"
        echo ""
        read -p "请选择 (0-7): " choice
        
        case $choice in
            1) full_environment_check ;;
            2) network_diagnosis ;;
            3) port_check ;;
            4) disk_space_check ;;
            5) permission_diagnosis ;;
            6) generate_diagnosis_report ;;
            7) performance_suggestions ;;
            0) break ;;
            *) echo -e "${RED}❌ 无效选择，请重试${NC}" && sleep 2 ;;
        esac
    done
}

# 缓存清理菜单
cache_cleanup_menu() {
    while true; do
        show_header
        show_environment
        echo -e "${PURPLE}🗑️ 缓存清理与重置:${NC}"
        echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
        echo -e "  ${CYAN}1)${NC}  清理 npm 缓存"
        echo -e "  ${CYAN}2)${NC}  清理 pnpm 缓存"
        echo -e "  ${CYAN}3)${NC}  清理 node_modules"
        echo -e "  ${CYAN}4)${NC}  清理构建缓存"
        echo -e "  ${CYAN}5)${NC}  清理 lock 文件"
        echo -e "  ${CYAN}6)${NC}  完全重置项目"
        echo -e "  ${CYAN}7)${NC}  清理系统临时文件"
        echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
        echo -e "  ${RED}0)${NC}  返回主菜单"
        echo ""
        read -p "请选择 (0-7): " choice
        
        case $choice in
            1) clean_npm_cache ;;
            2) clean_pnpm_cache ;;
            3) clean_node_modules ;;
            4) clean_build_cache ;;
            5) clean_lock_files ;;
            6) full_project_reset ;;
            7) clean_system_temp ;;
            0) break ;;
            *) echo -e "${RED}❌ 无效选择，请重试${NC}" && sleep 2 ;;
        esac
    done
}

# 项目信息菜单
project_info_menu() {
    while true; do
        show_header
        show_environment
        echo -e "${PURPLE}ℹ️  项目信息与帮助:${NC}"
        echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
        echo -e "  ${CYAN}1)${NC}  查看项目详细信息"
        echo -e "  ${CYAN}2)${NC}  查看依赖列表"
        echo -e "  ${CYAN}3)${NC}  查看脚本命令"
        echo -e "  ${CYAN}4)${NC}  查看配置文件"
        echo -e "  ${CYAN}5)${NC}  常见问题解答"
        echo -e "  ${CYAN}6)${NC}  查看更新日志"
        echo -e "  ${CYAN}7)${NC}  生成项目报告"
        echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
        echo -e "  ${RED}0)${NC}  返回主菜单"
        echo ""
        read -p "请选择 (0-7): " choice
        
        case $choice in
            1) show_project_info ;;
            2) show_dependencies ;;
            3) show_scripts ;;
            4) show_config_files ;;
            5) show_faq ;;
            6) show_changelog ;;
            7) generate_project_report ;;
            0) break ;;
            *) echo -e "${RED}❌ 无效选择，请重试${NC}" && sleep 2 ;;
        esac
    done
}

# 实现功能函数 (部分示例)

# 安装 NVM (增强版)
install_nvm() {
    echo -e "${BLUE}📥 安装 NVM...${NC}"
    echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
    
    # 检查是否已经安装
    if command_exists nvm || [[ -s "$NVM_DIR/nvm.sh" ]]; then
        # 尝试加载 NVM
        [[ -s "$NVM_DIR/nvm.sh" ]] && source "$NVM_DIR/nvm.sh"
        
        if command_exists nvm; then
            CURRENT_VERSION=$(nvm --version 2>/dev/null || echo "unknown")
            echo -e "  ${YELLOW}⚠️  NVM 已安装: v${CURRENT_VERSION}${NC}"
            echo ""
            read -p "是否要重新安装最新版本? (y/n): " reinstall_choice
            if [[ "$reinstall_choice" != "y" && "$reinstall_choice" != "Y" ]]; then
                echo -e "${CYAN}💡 保持当前安装 v${CURRENT_VERSION}${NC}"
                read -p "按任意键继续..." -n1 -s
                return
            fi
        fi
    fi
    
    echo -e "${CYAN}📋 NVM 安装方式选择:${NC}"
    echo "  1) 使用 curl 安装脚本 (推荐)"
    echo "  2) 使用 wget 安装脚本"
    echo "  3) 使用 Homebrew 安装 (仅 macOS)"
    echo "  4) 手动下载安装"
    echo ""
    read -p "请选择安装方式 (1-4): " install_choice
    
    # 获取最新版本
    echo -e "${BLUE}🔍 获取 NVM 最新版本信息...${NC}"
    LATEST_VERSION=$(curl -s https://api.github.com/repos/nvm-sh/nvm/releases/latest | grep '"tag_name"' | cut -d'"' -f4 2>/dev/null || echo "v0.40.3")
    echo -e "${CYAN}最新版本: ${LATEST_VERSION}${NC}"
    echo ""
    
    case $install_choice in
        1)
            echo -e "${BLUE}📥 使用 curl 安装 NVM ${LATEST_VERSION}...${NC}"
            if command_exists curl; then
                # 备份现有配置
                [[ -f ~/.bashrc ]] && cp ~/.bashrc ~/.bashrc.bak.$(date +%Y%m%d_%H%M%S) 2>/dev/null
                [[ -f ~/.zshrc ]] && cp ~/.zshrc ~/.zshrc.bak.$(date +%Y%m%d_%H%M%S) 2>/dev/null
                
                # 下载并安装
                curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/${LATEST_VERSION}/install.sh | bash
                
                if [ $? -eq 0 ]; then
                    echo -e "${GREEN}✅ NVM 安装成功${NC}"
                else
                    echo -e "${RED}❌ NVM 安装失败${NC}"
                fi
            else
                echo -e "${RED}❌ curl 未安装，请先安装 curl${NC}"
            fi
            ;;
        2)
            echo -e "${BLUE}📥 使用 wget 安装 NVM ${LATEST_VERSION}...${NC}"
            if command_exists wget; then
                # 备份现有配置
                [[ -f ~/.bashrc ]] && cp ~/.bashrc ~/.bashrc.bak.$(date +%Y%m%d_%H%M%S) 2>/dev/null
                [[ -f ~/.zshrc ]] && cp ~/.zshrc ~/.zshrc.bak.$(date +%Y%m%d_%H%M%S) 2>/dev/null
                
                # 下载并安装
                wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/${LATEST_VERSION}/install.sh | bash
                
                if [ $? -eq 0 ]; then
                    echo -e "${GREEN}✅ NVM 安装成功${NC}"
                else
                    echo -e "${RED}❌ NVM 安装失败${NC}"
                fi
            else
                echo -e "${RED}❌ wget 未安装，请先安装 wget${NC}"
            fi
            ;;
        3)
            echo -e "${BLUE}📥 使用 Homebrew 安装 NVM...${NC}"
            if command_exists brew; then
                brew install nvm
                if [ $? -eq 0 ]; then
                    echo -e "${GREEN}✅ NVM 安装成功${NC}"
                    echo -e "${CYAN}🔧 配置环境变量...${NC}"
                    
                    # 为 Homebrew 安装的 NVM 配置环境
                    NVM_HOMEBREW_PREFIX="$(brew --prefix nvm)"
                    if [[ -n "$NVM_HOMEBREW_PREFIX" ]]; then
                        echo "export NVM_DIR=\"$HOME/.nvm\"" >> ~/.zshrc
                        echo "[ -s \"$NVM_HOMEBREW_PREFIX/nvm.sh\" ] && . \"$NVM_HOMEBREW_PREFIX/nvm.sh\"" >> ~/.zshrc
                        echo "[ -s \"$NVM_HOMEBREW_PREFIX/etc/bash_completion.d/nvm\" ] && . \"$NVM_HOMEBREW_PREFIX/etc/bash_completion.d/nvm\"" >> ~/.zshrc
                        echo -e "${GREEN}✅ 环境配置完成${NC}"
                    fi
                else
                    echo -e "${RED}❌ NVM 安装失败${NC}"
                fi
            else
                echo -e "${RED}❌ Homebrew 未安装，请先安装 Homebrew${NC}"
                echo -e "${CYAN}💡 Homebrew 安装命令: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"${NC}"
            fi
            ;;
        4)
            echo -e "${BLUE}📁 手动下载安装指引:${NC}"
            echo -e "${CYAN}1. 访问 NVM GitHub 页面: https://github.com/nvm-sh/nvm${NC}"
            echo -e "${CYAN}2. 下载最新版本: ${LATEST_VERSION}${NC}"
            echo -e "${CYAN}3. 按照官方文档进行安装${NC}"
            echo -e "${CYAN}4. 或者使用以下命令:${NC}"
            echo "   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/${LATEST_VERSION}/install.sh | bash"
            ;;
        *)
            echo -e "${RED}❌ 无效选择${NC}"
            read -p "按任意键继续..." -n1 -s
            return
            ;;
    esac
    
    echo ""
    echo -e "${CYAN}🔧 环境配置:${NC}"
    
    # 检查并配置 shell 环境
    SHELL_RC=""
    if [[ "$SHELL" == *"zsh"* ]]; then
        SHELL_RC="~/.zshrc"
    elif [[ "$SHELL" == *"bash"* ]]; then
        SHELL_RC="~/.bashrc"
    fi
    
    echo -e "${CYAN}当前 Shell: $SHELL${NC}"
    echo -e "${CYAN}配置文件: $SHELL_RC${NC}"
    
    # 重新加载环境
    export NVM_DIR="$HOME/.nvm"
    [[ -s "$NVM_DIR/nvm.sh" ]] && source "$NVM_DIR/nvm.sh"
    [[ -s "$NVM_DIR/bash_completion" ]] && source "$NVM_DIR/bash_completion"
    
    echo ""
    echo -e "${CYAN}📋 NVM 验证:${NC}"
    
    if command_exists nvm; then
        NVM_VERSION=$(nvm --version 2>/dev/null || echo "unknown")
        echo -e "  ${GREEN}✅ NVM 版本: v${NVM_VERSION}${NC}"
        echo -e "  ${GREEN}✅ NVM 目录: $NVM_DIR${NC}"
        
        # 显示可用的 Node.js 版本
        echo -e "  ${GREEN}✅ 正在检查可用的 Node.js 版本...${NC}"
        nvm list-remote --lts 2>/dev/null | tail -5 || echo "    无法获取远程版本列表"
        
        echo ""
        echo -e "${CYAN}💡 常用 NVM 命令:${NC}"
        echo "  nvm install node       - 安装最新版本 Node.js"
        echo "  nvm install --lts      - 安装最新 LTS 版本"
        echo "  nvm use node           - 使用最新版本"
        echo "  nvm list               - 查看已安装版本"
        echo "  nvm alias default node - 设置默认版本"
        
        echo ""
        echo -e "${GREEN}✅ NVM 安装完成！${NC}"
        echo -e "${YELLOW}⚠️  请重新打开终端或运行以下命令加载 NVM:${NC}"
        echo -e "${CYAN}source $SHELL_RC${NC}"
    else
        echo -e "  ${RED}❌ NVM 验证失败${NC}"
        echo -e "  ${YELLOW}⚠️  可能需要手动配置环境变量${NC}"
        echo -e "  ${CYAN}请检查 $SHELL_RC 文件中的 NVM 配置${NC}"
    fi
    
    read -p "按任意键继续..." -n1 -s
}

# 安装推荐 Node.js 版本
install_recommended_node() {
    echo -e "${BLUE}📥 安装推荐 Node.js 版本 ${RECOMMENDED_NODE}...${NC}"
    if command_exists nvm; then
        nvm install ${RECOMMENDED_NODE}
        nvm use ${RECOMMENDED_NODE}
        echo -e "${GREEN}✅ Node.js ${RECOMMENDED_NODE} 安装并切换成功${NC}"
    else
        echo -e "${RED}❌ 请先安装 NVM${NC}"
    fi
    read -p "按任意键继续..." -n1 -s
}

# 配置淘宝镜像
setup_taobao_mirror() {
    echo -e "${BLUE}🚀 配置淘宝镜像...${NC}"
    bash scripts/setup-npm-mirrors.sh
    read -p "按任意键继续..." -n1 -s
}

# 验证镜像配置
verify_mirrors() {
    echo -e "${BLUE}🔍 验证镜像配置...${NC}"
    bash scripts/verify-mirrors.sh
    read -p "按任意键继续..." -n1 -s
}

# npm 快速安装
npm_install_fast() {
    echo -e "${BLUE}📦 NPM 快速安装依赖...${NC}"
    npm run install:fast
    read -p "按任意键继续..." -n1 -s
}

# pnpm 快速安装
pnpm_install_fast() {
    echo -e "${BLUE}📦 PNPM 快速安装依赖...${NC}"
    if command_exists pnpm; then
        npm run pnpm:install
    else
        echo -e "${RED}❌ 请先安装 PNPM${NC}"
    fi
    read -p "按任意键继续..." -n1 -s
}

# 安装 PNPM (增强版)
install_pnpm() {
    echo -e "${BLUE}📥 安装 PNPM...${NC}"
    echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
    
    # 检查是否已经安装
    if command_exists pnpm; then
        CURRENT_VERSION=$(pnpm --version)
        echo -e "  ${YELLOW}⚠️  PNPM 已安装: v${CURRENT_VERSION}${NC}"
        echo ""
        read -p "是否要升级到最新版本? (y/n): " upgrade_choice
        if [[ "$upgrade_choice" == "y" || "$upgrade_choice" == "Y" ]]; then
            echo -e "${BLUE}🔄 升级 PNPM 到最新版本...${NC}"
            npm install -g pnpm@latest
            if [ $? -eq 0 ]; then
                NEW_VERSION=$(pnpm --version)
                echo -e "${GREEN}✅ PNPM 升级成功: v${CURRENT_VERSION} → v${NEW_VERSION}${NC}"
            else
                echo -e "${RED}❌ PNPM 升级失败${NC}"
            fi
        else
            echo -e "${CYAN}💡 保持当前版本 v${CURRENT_VERSION}${NC}"
        fi
    else
        echo -e "${CYAN}📋 PNPM 安装方式选择:${NC}"
        echo "  1) 使用 npm 安装 (推荐)"
        echo "  2) 使用 curl 安装脚本"
        echo "  3) 使用 Homebrew 安装 (仅 macOS)"
        echo ""
        read -p "请选择安装方式 (1-3): " install_choice
        
        case $install_choice in
            1)
                echo -e "${BLUE}📥 使用 npm 安装 PNPM...${NC}"
                npm install -g pnpm
                if [ $? -eq 0 ]; then
                    INSTALLED_VERSION=$(pnpm --version)
                    echo -e "${GREEN}✅ PNPM 安装成功: v${INSTALLED_VERSION}${NC}"
                    echo -e "${CYAN}🔧 自动配置镜像源...${NC}"
                    pnpm config set registry https://registry.npmmirror.com
                    echo -e "${GREEN}✅ 镜像源配置完成${NC}"
                else
                    echo -e "${RED}❌ PNPM 安装失败${NC}"
                fi
                ;;
            2)
                echo -e "${BLUE}📥 使用安装脚本安装 PNPM...${NC}"
                if command_exists curl; then
                    curl -fsSL https://get.pnpm.io/install.sh | sh -
                    # 重新加载 shell 环境
                    source ~/.bashrc 2>/dev/null || source ~/.zshrc 2>/dev/null || true
                    if command_exists pnpm; then
                        INSTALLED_VERSION=$(pnpm --version)
                        echo -e "${GREEN}✅ PNPM 安装成功: v${INSTALLED_VERSION}${NC}"
                        echo -e "${CYAN}🔧 自动配置镜像源...${NC}"
                        pnpm config set registry https://registry.npmmirror.com
                        echo -e "${GREEN}✅ 镜像源配置完成${NC}"
                    else
                        echo -e "${RED}❌ PNPM 安装失败，请重新打开终端或手动配置环境变量${NC}"
                    fi
                else
                    echo -e "${RED}❌ curl 未安装，请先安装 curl${NC}"
                fi
                ;;
            3)
                echo -e "${BLUE}📥 使用 Homebrew 安装 PNPM...${NC}"
                if command_exists brew; then
                    brew install pnpm
                    if [ $? -eq 0 ]; then
                        INSTALLED_VERSION=$(pnpm --version)
                        echo -e "${GREEN}✅ PNPM 安装成功: v${INSTALLED_VERSION}${NC}"
                        echo -e "${CYAN}🔧 自动配置镜像源...${NC}"
                        pnpm config set registry https://registry.npmmirror.com
                        echo -e "${GREEN}✅ 镜像源配置完成${NC}"
                    else
                        echo -e "${RED}❌ PNPM 安装失败${NC}"
                    fi
                else
                    echo -e "${RED}❌ Homebrew 未安装，请先安装 Homebrew${NC}"
                    echo -e "${CYAN}💡 Homebrew 安装命令: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"${NC}"
                fi
                ;;
            *)
                echo -e "${RED}❌ 无效选择${NC}"
                ;;
        esac
    fi
    
    echo ""
    echo -e "${CYAN}📋 PNPM 验证:${NC}"
    if command_exists pnpm; then
        echo -e "  ${GREEN}✅ PNPM 版本: $(pnpm --version)${NC}"
        echo -e "  ${GREEN}✅ 安装路径: $(which pnpm)${NC}"
        echo -e "  ${GREEN}✅ 镜像源: $(pnpm config get registry)${NC}"
        echo ""
        echo -e "${CYAN}💡 常用 PNPM 命令:${NC}"
        echo "  pnpm install          - 安装依赖"
        echo "  pnpm add <package>     - 添加依赖"
        echo "  pnpm run dev           - 运行开发服务器"
        echo "  pnpm store prune       - 清理存储"
    else
        echo -e "  ${RED}❌ PNPM 验证失败${NC}"
    fi
    
    read -p "按任意键继续..." -n1 -s
}

# 一键启动脚本
start_with_script() {
    echo -e "${BLUE}🚀 启动一键启动脚本...${NC}"
    if [[ -f "scripts/start-pnpm.sh" ]]; then
        ./scripts/start-pnpm.sh
    else
        echo -e "${RED}❌ scripts/start-pnpm.sh 脚本不存在${NC}"
    fi
    read -p "按任意键继续..." -n1 -s
}

# 运行 ESLint
run_eslint() {
    echo -e "${BLUE}🔍 运行 ESLint 检查...${NC}"
    npm run lint
    read -p "按任意键继续..." -n1 -s
}

# 清理 npm 缓存
clean_npm_cache() {
    echo -e "${BLUE}🗑️ 清理 npm 缓存...${NC}"
    echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
    
    if command_exists npm; then
        echo -e "${CYAN}正在清理 npm 缓存...${NC}"
        npm cache clean --force
        
        # 获取缓存大小信息
        if command_exists du; then
            CACHE_DIR=$(npm config get cache)
            if [[ -d "$CACHE_DIR" ]]; then
                CACHE_SIZE=$(du -sh "$CACHE_DIR" 2>/dev/null | cut -f1 || echo "未知")
                echo -e "${CYAN}缓存目录: $CACHE_DIR${NC}"
                echo -e "${CYAN}剩余大小: $CACHE_SIZE${NC}"
            fi
        fi
        
        echo -e "${GREEN}✅ npm 缓存清理完成${NC}"
    else
        echo -e "${RED}❌ npm 未安装${NC}"
    fi
    
    echo ""
    read -p "按任意键继续..." -n1 -s
}

# 清理 pnpm 缓存
clean_pnpm_cache() {
    echo -e "${BLUE}🗑️ 清理 pnpm 缓存...${NC}"
    echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
    
    if command_exists pnpm; then
        echo -e "${CYAN}正在清理 pnpm 存储...${NC}"
        pnpm store prune
        
        echo -e "${CYAN}正在清理 pnpm 缓存...${NC}"
        pnpm cache dir 2>/dev/null && pnpm cache clear 2>/dev/null
        
        # 获取存储信息
        echo -e "${CYAN}存储状态:${NC}"
        pnpm store status 2>/dev/null || echo "无法获取存储状态"
        
        echo -e "${GREEN}✅ pnpm 缓存清理完成${NC}"
    else
        echo -e "${RED}❌ pnpm 未安装${NC}"
    fi
    
    echo ""
    read -p "按任意键继续..." -n1 -s
}

# 清理 node_modules
clean_node_modules() {
    echo -e "${BLUE}🗑️ 清理 node_modules...${NC}"
    echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
    
    if [[ -d "node_modules" ]]; then
        # 获取大小信息
        if command_exists du; then
            NODE_MODULES_SIZE=$(du -sh node_modules 2>/dev/null | cut -f1 || echo "未知")
            echo -e "${CYAN}当前 node_modules 大小: $NODE_MODULES_SIZE${NC}"
        fi
        
        echo -e "${YELLOW}⚠️  即将删除 node_modules 目录${NC}"
        read -p "确认删除? (y/n): " confirm
        
        if [[ "$confirm" == "y" || "$confirm" == "Y" ]]; then
            echo -e "${CYAN}正在删除 node_modules...${NC}"
            rm -rf node_modules
            echo -e "${GREEN}✅ node_modules 清理完成${NC}"
            
            echo -e "${CYAN}💡 提示: 可以运行以下命令重新安装依赖:${NC}"
            echo -e "   npm install 或 pnpm install"
        else
            echo -e "${YELLOW}❌ 已取消删除${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  node_modules 目录不存在${NC}"
    fi
    
    echo ""
    read -p "按任意键继续..." -n1 -s
}

# 清理构建缓存
clean_build_cache() {
    echo -e "${BLUE}🗑️ 清理构建缓存...${NC}"
    echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
    
    # 清理常见的构建缓存目录和文件
    CACHE_DIRS=("dist" "build" ".vite" "node_modules/.vite" "node_modules/.cache")
    CLEANED_COUNT=0
    
    for dir in "${CACHE_DIRS[@]}"; do
        if [[ -d "$dir" ]]; then
            if command_exists du; then
                DIR_SIZE=$(du -sh "$dir" 2>/dev/null | cut -f1 || echo "未知")
                echo -e "${CYAN}正在清理 $dir (大小: $DIR_SIZE)...${NC}"
            else
                echo -e "${CYAN}正在清理 $dir...${NC}"
            fi
            rm -rf "$dir"
            CLEANED_COUNT=$((CLEANED_COUNT + 1))
        fi
    done
    
    # 清理临时文件
    TEMP_FILES=("*.log" "*.tmp" ".DS_Store")
    for pattern in "${TEMP_FILES[@]}"; do
        if ls $pattern 1> /dev/null 2>&1; then
            echo -e "${CYAN}正在清理 $pattern 文件...${NC}"
            rm -f $pattern
            CLEANED_COUNT=$((CLEANED_COUNT + 1))
        fi
    done
    
    if [ $CLEANED_COUNT -gt 0 ]; then
        echo -e "${GREEN}✅ 构建缓存清理完成 (清理了 $CLEANED_COUNT 项)${NC}"
    else
        echo -e "${YELLOW}⚠️  没有发现需要清理的构建缓存${NC}"
    fi
    
    echo ""
    read -p "按任意键继续..." -n1 -s
}

# 清理 lock 文件
clean_lock_files() {
    echo -e "${BLUE}🗑️ 清理 lock 文件...${NC}"
    echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
    
    LOCK_FILES=("package-lock.json" "pnpm-lock.yaml" "yarn.lock")
    CLEANED_COUNT=0
    
    echo -e "${YELLOW}⚠️  即将删除以下 lock 文件:${NC}"
    for file in "${LOCK_FILES[@]}"; do
        if [[ -f "$file" ]]; then
            echo -e "   - $file"
        fi
    done
    
    echo ""
    read -p "确认删除? (y/n): " confirm
    
    if [[ "$confirm" == "y" || "$confirm" == "Y" ]]; then
        for file in "${LOCK_FILES[@]}"; do
            if [[ -f "$file" ]]; then
                echo -e "${CYAN}正在删除 $file...${NC}"
                rm -f "$file"
                CLEANED_COUNT=$((CLEANED_COUNT + 1))
            fi
        done
        
        if [ $CLEANED_COUNT -gt 0 ]; then
            echo -e "${GREEN}✅ lock 文件清理完成 (删除了 $CLEANED_COUNT 个文件)${NC}"
            echo -e "${CYAN}💡 提示: 下次安装依赖时会重新生成 lock 文件${NC}"
        else
            echo -e "${YELLOW}⚠️  没有发现 lock 文件${NC}"
        fi
    else
        echo -e "${YELLOW}❌ 已取消删除${NC}"
    fi
    
    echo ""
    read -p "按任意键继续..." -n1 -s
}

# 完全重置项目
full_project_reset() {
    echo -e "${RED}🚨 完全重置项目${NC}"
    echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
    
    echo -e "${YELLOW}⚠️  此操作将删除以下内容:${NC}"
    echo -e "   - node_modules 目录"
    echo -e "   - 所有 lock 文件"
    echo -e "   - 构建缓存目录"
    echo -e "   - npm/pnpm 缓存"
    echo -e "   - 临时文件"
    echo ""
    echo -e "${RED}⚠️  这是一个不可逆操作！${NC}"
    echo ""
    read -p "确认完全重置项目? (输入 'RESET' 确认): " confirm
    
    if [[ "$confirm" == "RESET" ]]; then
        echo -e "${CYAN}🔄 开始完全重置项目...${NC}"
        echo ""
        
        # 清理 node_modules
        if [[ -d "node_modules" ]]; then
            echo -e "${CYAN}1. 删除 node_modules...${NC}"
            rm -rf node_modules
        fi
        
        # 清理 lock 文件
        LOCK_FILES=("package-lock.json" "pnpm-lock.yaml" "yarn.lock")
        echo -e "${CYAN}2. 删除 lock 文件...${NC}"
        for file in "${LOCK_FILES[@]}"; do
            [[ -f "$file" ]] && rm -f "$file" && echo -e "   删除 $file"
        done
        
        # 清理构建缓存
        echo -e "${CYAN}3. 清理构建缓存...${NC}"
        CACHE_DIRS=("dist" "build" ".vite" "node_modules/.vite" "node_modules/.cache")
        for dir in "${CACHE_DIRS[@]}"; do
            [[ -d "$dir" ]] && rm -rf "$dir" && echo -e "   删除 $dir"
        done
        
        # 清理包管理器缓存
        echo -e "${CYAN}4. 清理包管理器缓存...${NC}"
        command_exists npm && npm cache clean --force
        command_exists pnpm && pnpm store prune
        
        # 清理临时文件
        echo -e "${CYAN}5. 清理临时文件...${NC}"
        rm -f *.log *.tmp .DS_Store
        
        echo ""
        echo -e "${GREEN}✅ 项目重置完成！${NC}"
        echo -e "${CYAN}💡 下一步操作建议:${NC}"
        echo -e "   1. npm install 或 pnpm install (重新安装依赖)"
        echo -e "   2. npm run dev 或 pnpm dev (启动开发服务器)"
    else
        echo -e "${YELLOW}❌ 已取消重置操作${NC}"
    fi
    
    echo ""
    read -p "按任意键继续..." -n1 -s
}

# 清理系统临时文件
clean_system_temp() {
    echo -e "${BLUE}🗑️ 清理系统临时文件...${NC}"
    echo -e "${GRAY}─────────────────────────────────────────────────────────────${NC}"
    
    CLEANED_COUNT=0
    
    # macOS 特有的文件
    if [[ "$(uname)" == "Darwin" ]]; then
        echo -e "${CYAN}检测到 macOS 系统，清理 macOS 特有临时文件...${NC}"
        
        # 清理 .DS_Store 文件
        if find . -name ".DS_Store" -type f 2>/dev/null | head -1 | grep -q "."; then
            echo -e "${CYAN}正在清理 .DS_Store 文件...${NC}"
            find . -name ".DS_Store" -type f -delete 2>/dev/null
            CLEANED_COUNT=$((CLEANED_COUNT + 1))
        fi
        
        # 清理 Thumb.db (如果存在)
        if find . -name "Thumbs.db" -type f 2>/dev/null | head -1 | grep -q "."; then
            echo -e "${CYAN}正在清理 Thumbs.db 文件...${NC}"
            find . -name "Thumbs.db" -type f -delete 2>/dev/null
            CLEANED_COUNT=$((CLEANED_COUNT + 1))
        fi
    fi
    
    # 通用临时文件
    TEMP_PATTERNS=("*.tmp" "*.log" "*.swp" "*.swo" "*~")
    for pattern in "${TEMP_PATTERNS[@]}"; do
        if find . -name "$pattern" -type f 2>/dev/null | head -1 | grep -q "."; then
            echo -e "${CYAN}正在清理 $pattern 文件...${NC}"
            find . -name "$pattern" -type f -delete 2>/dev/null
            CLEANED_COUNT=$((CLEANED_COUNT + 1))
        fi
    done
    
    # 编辑器临时文件
    EDITOR_TEMP=(".vscode/.history" ".idea" "*.orig")
    for pattern in "${EDITOR_TEMP[@]}"; do
        if [[ -d "$pattern" ]] || find . -name "$pattern" -type f 2>/dev/null | head -1 | grep -q "."; then
            echo -e "${CYAN}正在清理编辑器临时文件 $pattern...${NC}"
            rm -rf $pattern 2>/dev/null
            CLEANED_COUNT=$((CLEANED_COUNT + 1))
        fi
    done
    
    if [ $CLEANED_COUNT -gt 0 ]; then
        echo -e "${GREEN}✅ 系统临时文件清理完成 (清理了 $CLEANED_COUNT 类文件)${NC}"
    else
        echo -e "${YELLOW}⚠️  没有发现需要清理的系统临时文件${NC}"
    fi
    
    echo ""
    read -p "按任意键继续..." -n1 -s
}

# 更多功能函数可以根据需要添加...

# 主程序
main() {
    # 检查是否在项目根目录
    if [[ ! -f "package.json" ]]; then
        echo -e "${RED}❌ 请在项目根目录下运行此脚本${NC}"
        exit 1
    fi
    
    while true; do
        show_header
        show_environment
        show_main_menu
        read -p "请选择功能 (0-8): " choice
        
        case $choice in
            1) nodejs_management_menu ;;
            2) mirror_management_menu ;;
            3) dependency_management_menu ;;
            4) project_build_menu ;;
            5) code_quality_menu ;;
            6) environment_diagnosis_menu ;;
            7) cache_cleanup_menu ;;
            8) project_info_menu ;;
            0) 
                echo -e "${GREEN}👋 感谢使用 MMS-UI 开发工具菜单！${NC}"
                exit 0
                ;;
            *) 
                echo -e "${RED}❌ 无效选择，请重试${NC}"
                sleep 2
                ;;
        esac
    done
}

# 启动主程序
main "$@"