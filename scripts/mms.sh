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

# 安装 NVM
install_nvm() {
    echo -e "${BLUE}📥 安装 NVM...${NC}"
    if command_exists nvm; then
        echo -e "${YELLOW}⚠️  NVM 已安装${NC}"
    else
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        echo -e "${GREEN}✅ NVM 安装完成，请重新打开终端或运行: source ~/.bashrc${NC}"
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

# 一键启动脚本
start_with_script() {
    echo -e "${BLUE}🚀 启动一键启动脚本...${NC}"
    if [[ -f "start-pnpm.sh" ]]; then
        ./start-pnpm.sh
    else
        echo -e "${RED}❌ start-pnpm.sh 脚本不存在${NC}"
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
    npm cache clean --force
    echo -e "${GREEN}✅ npm 缓存清理完成${NC}"
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