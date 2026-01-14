<template>
  <div class="home-container layout-pd">
<<<<<<< HEAD
    <el-row :gutter="15" class="home-card-one mb15">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="home-card-item flex col-between">
          <div class="flex flex-auto">
            <div class="avatar-box">
              <div class="avatar pulse">
                <el-image
                    :src="userInfos.photo || 'https://sxpcwlkj.oss-cn-beijing.aliyuncs.com/defimg.png'"
                    fit="fill"
                ></el-image>
              </div>
=======
    <!-- 顶部统计卡片 -->
    <el-row :gutter="15" class="home-card-stats">
      <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
        <div class="stat-card stat-card-orange">
          <div class="stat-card-header">
            <div class="stat-icon">
              <el-icon style="font-size: 2rem" color="#ff8c00"><ele-Memo /></el-icon>
>>>>>>> eadc6d673a4b0e53f3c3decb20c14aae2f3768c5
            </div>

            <div>
              <div class="stat-label">今日订单</div>
              <div class="stat-subtitle">Today's orders</div>
            </div>
          </div>
<<<<<<< HEAD
          <div class="flex">
            <div class="home-card-item-term text-center cursor-pointer">
              <div class="font20" style="margin-bottom: 15px">任务</div>
              <div class="f-w-600 f-18">{{ state.systemData.task }}</div>
            </div>
            <div class="home-card-item-term text-center cursor-pointer">
              <div class="font20" style="margin-bottom: 15px">用户</div>
              <div class="f-w-600 f-18">{{ state.systemData.userTool }}</div>
            </div>
            <div class="home-card-item-term text-center cursor-pointer">
              <div class="font20" style="margin-bottom: 15px">公告</div>
              <div class="f-w-600 f-18">{{ state.systemData.newsTool }}</div>
=======
          
          <div class="stat-content flex mt10 ml10">
            <div class="stat-value">{{ state.statsData.todayOrders }}</div>
            <div class="stat-trend ml20" :class="state.statsData.ordersChange >= 0 ? 'trend-up' : 'trend-down'">
              <span>{{ state.statsData.ordersChange >= 0 ? '+' : '' }}{{ state.statsData.ordersChange }}</span>
              <el-icon><ele-Top v-if="state.statsData.ordersChange >= 0" /><ele-Bottom v-else /></el-icon>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
        <div class="stat-card stat-card-green">
          <div class="stat-card-header">
            <div class="stat-icon">
              <el-icon style="font-size: 2rem" color="#2dac34"><ele-User /></el-icon>
            </div>
            <div>
              <div class="stat-label">今日用户</div>
              <div class="stat-subtitle">today's users</div>
            </div>
          </div>
          <div class="stat-content flex mt10 ml10">
            <div class="stat-value">{{ state.statsData.todayUsers }}</div>
            <div class="stat-trend ml20" :class="state.statsData.usersChange >= 0 ? 'trend-up' : 'trend-down'">
              <span>{{ state.statsData.usersChange >= 0 ? '+' : '' }}{{ state.statsData.usersChange }}</span>
              <el-icon><ele-Top v-if="state.statsData.usersChange >= 0" /><ele-Bottom v-else /></el-icon>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
        <div class="stat-card stat-card-blue">
          <div class="stat-card-header">
            <div class="stat-icon">
              <el-icon style="font-size: 2rem" color="#409eff"><ele-Tickets /></el-icon>
            </div>
            <div>
              <div class="stat-label">今日售后</div>
              <div class="stat-subtitle">After-sales service</div>
            </div>
          </div>
          <div class="stat-content flex mt10 ml10">
            <div class="stat-value">{{ state.statsData.todayAfterSales }}</div>
            <div class="stat-trend ml20" :class="state.statsData.afterSalesChange >= 0 ? 'trend-up' : 'trend-down'">
              <span>{{ state.statsData.afterSalesChange >= 0 ? '+' : '' }}{{ state.statsData.afterSalesChange }}</span>
              <el-icon><ele-Top v-if="state.statsData.afterSalesChange >= 0" /><ele-Bottom v-else /></el-icon>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
        <div class="stat-card stat-card-purple">
          <div class="stat-card-header">
            <div class="stat-icon">
              <el-icon style="font-size: 2rem" color="#9c27b0"><ele-TrendCharts /></el-icon>
            </div>
            <div>
              <div class="stat-label">今日销售额</div>
              <div class="stat-subtitle">Today's sales</div>
            </div>
          </div>
          <div class="stat-content flex mt10 ml10">
            <div class="stat-value">{{ state.statsData.todaySales }}</div>
            <div class="stat-trend ml20" :class="state.statsData.salesChange >= 0 ? 'trend-up' : 'trend-down'">
              <span>{{ state.statsData.salesChange >= 0 ? '+' : '' }}{{ state.statsData.salesChange }}</span>
              <el-icon><ele-Top v-if="state.statsData.salesChange >= 0" /><ele-Bottom v-else /></el-icon>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
        <div class="stat-card stat-card-gray">
          <div class="stat-card-header">
            <div class="stat-icon">
              <el-icon style="font-size: 2rem" color="#606266"><ele-User /></el-icon>
            </div>
            <div>
              <div class="stat-label">总用户</div>
              <div class="stat-subtitle">Total Users</div>
            </div>
          </div>
          <div class="stat-content flex mt10 ml10">
            <div class="stat-value">{{ state.statsData.totalUsers }}</div>
            <div class="stat-trend ml20" :class="state.statsData.totalUsersChange >= 0 ? 'trend-up' : 'trend-down'">
              <span>{{ state.statsData.totalUsersChange >= 0 ? '+' : '' }}{{ state.statsData.totalUsersChange }}</span>
              <el-icon><ele-Top v-if="state.statsData.totalUsersChange >= 0" /><ele-Bottom v-else /></el-icon>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="4">
        <div class="stat-card stat-card-red">
          <div class="stat-card-header">
            <div class="stat-icon">
              <el-icon style="font-size: 2rem" color="#f56c6c"><ele-Wallet /></el-icon>
            </div>
            <div>
              <div class="stat-label">总收入</div>
              <div class="stat-subtitle">Total Revenue</div>
            </div>
          </div>
          <div class="stat-content flex mt10 ml10">
            <div class="stat-value">{{ state.statsData.totalRevenue }}</div>
            <div class="stat-trend ml20" :class="state.statsData.revenueChange >= 0 ? 'trend-up' : 'trend-down'">
              <span>{{ state.statsData.revenueChange >= 0 ? '+' : '' }}{{ state.statsData.revenueChange }}</span>
              <el-icon><ele-Top v-if="state.statsData.revenueChange >= 0" /><ele-Bottom v-else /></el-icon>
>>>>>>> eadc6d673a4b0e53f3c3decb20c14aae2f3768c5
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="home-card-two">
<<<<<<< HEAD
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
=======
      <el-col :xs="24" :sm="24" :md="14" :lg="16" :xl="16">
>>>>>>> eadc6d673a4b0e53f3c3decb20c14aae2f3768c5
        <div class="home-card-item mb15">
          <div class="home-card-item-title">快捷菜单</div>
          <div class="home-card-item-content" style="display: flex; flex-direction: row;">
            <div
<<<<<<< HEAD
                v-for="(item, index) in state.systemData.fastList"
                :key="index"
                @click="router.push(item.path)"
                class="item-content-term center-container"
            >
              <Animate>
                <div class="icon text-center">
                  <SvgIcon :name="item.icon" style="font-size: 2rem" color="#00A8E8"/>
                </div>
                <div class="desc">{{ item.name }}</div>
              </Animate>
=======
              v-for="(item, index) in state.quickMenuData"
              :key="index"
              @click="router.push(item.path)"
              class="quick-menu-item flex-col row-center col-center cursor-pointer"
            >
              <div class="quick-menu-icon">
                <el-icon style="font-size: 3rem"><component :is="item.icon" /></el-icon>
              </div>
              <div class="quick-menu-text">{{ item.name }}</div>
>>>>>>> eadc6d673a4b0e53f3c3decb20c14aae2f3768c5
            </div>
          </div>
        </div>
      </el-col>
<<<<<<< HEAD
      <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
        <div class="home-card-item mb15">
          <div class="home-card-item-title">MMS项目</div>
          <div class="home-card-item-content flex flex-wrap">
            <div
                v-for="(item, index) in state.systemData.eventList"
                :key="index"
                @click="openWindow(item.remark)"
                class="item-content-event center-container cursor-pointer"
            >
              <Animate>
                <div class="icon text-center">
                  <el-image
                      style="width: 50px; height: 50px"
                      :src="item.configValue"
                      fit="fill"
                  ></el-image>
                </div>
                <div class="desc">{{ item.configName }}</div>
              </Animate>
            </div>
            <div
                v-if="state.systemData.eventList.length < 12"
                @click="state.eventDialog.isShowDialog = true"
                class="item-content-event flex-col center-container cursor-pointer"
            >
              <div class="icon">
                <el-icon style="font-size: 3.5rem" color="#c9c9c9">
                  <ele-CirclePlusFilled/>
                </el-icon>
              </div>
               <div class="desc">添加项目</div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
        <div class="home-card-item mb15">
          <div class="home-card-item-title">系统公告</div>
          <div class="home-card-item-content ">
            <div
                v-for="(item, index) in state.sysNoticeData"
                :key="index"
                class="flex-row justify-between items-center p-10 cursor-pointer"
                style="height: 40px"
                @click="state.noticeDrawer = true; state.notice = item"
            >
              <div class="f-16">{{ index + 1 }}. {{ item.title }}</div>
              <div class="f-18">
                <el-icon style="font-size: 1rem" color="#c9c9c9">
                  <ele-ArrowRightBold/>
                </el-icon>
=======
      <el-col :xs="24" :sm="24" :md="10" :lg="8" :xl="8">
        <div class="home-card-item mb15">
          <div class="home-card-item-title">系统公告</div>
          <div class="home-card-item-content">
            <div class="notice-list">
              <div
                v-for="(item, index) in state.sysNoticeData"
                :key="index"
                class="notice-item flex row-between col-center cursor-pointer"
              >
                <div class="flex-1 f-16">{{ index + 1 }}. {{ item.title }}</div>
                <div class="f-14" style="color: #999">{{ item.createTime }}</div>
>>>>>>> eadc6d673a4b0e53f3c3decb20c14aae2f3768c5
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="home-card-three">
<<<<<<< HEAD
      <el-col
          :xs="24"
          :sm="24"
          :md="auth('docAdmin:docUser:list') ? 12 : 18"
          :lg="auth('docAdmin:docUser:list') ? 12 : 18"
          :xl="auth('docAdmin:docUser:list') ? 12 : 18"
      >
        <div class="home-card-item mb15 setting">
          <div class="home-card-item-title">系统信息</div>
          <div class="home-card-item-content  p-20">
            <el-row :gutter="30">
                <!--左边-->
                <el-col
                    :xs="24"
                    :sm="24"
                    :md="24"
                    :lg="24"
                    :xl="24"
                >
                  <!--图表 https://vue-data-ui.graphieros.com/ -->
                  <el-row>
                    <el-col
                        :xs="24"
                        :sm="24"
                        :md="24"
                        :lg="12"
                        :xl="12"
                    >
                      <VueDataUi component="VueUiSparkline" :dataset="dataset1" :config="config1"/>
                    </el-col>
                    <el-col
                        :xs="24"
                        :sm="24"
                        :md="24"
                        :lg="12"
                        :xl="12"
                    >
                      <VueDataUi component="VueUiSparkline" :dataset="dataset2" :config="config2"/>
                    </el-col>
                  </el-row>
                </el-col>
                <!--右边-->
                <el-col
                    :xs="24"
                    :sm="24"
                    :md="24"
                    :lg="24"
                    :xl="24"
                >
                  <div class="flex-col" style="min-height: 300px">
                    <div class="flex-auto flex-row pl-4" style="margin-top: 8px">
                      <div class="f-16 flex-1 system_title" style="line-height: 30px">系统名称：</div>
                      <div class="f-14 flex-2" style="color: #858585; line-height: 30px">
                        {{ state.systemData.systemInfo.name }}
                      </div>
                    </div>
                    <div class="flex-auto flex-row pl-4">
                      <div class="f-16 flex-1 system_title" style="line-height: 30px">系统版本：</div>
                      <div class="f-14 flex-2" style="color: #858585; line-height: 30px">
                        {{ state.systemData.systemInfo.version }}
                      </div>
                    </div>
                    <div class="flex-auto flex-row pl-4">
                      <div class="f-16 flex-1 system_title" style="line-height: 30px">系统文档：</div>
                      <div
                          class="f-14 flex-2 cursor-pointer"
                          style="color: #666dff; line-height: 30px"
                          @click="openWindow(state.systemData.systemInfo.docUrl)"
                      >
                        {{ state.systemData.systemInfo.docUrl }}
                      </div>
                    </div>
                    <div class="flex-auto flex-row pl-4">
                      <div class="f-12 flex-4" style="color: #858585; line-height: 20px">
                        {{ state.systemData.systemInfo.describe }}
                      </div>
                    </div>
                  </div>

                </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col
          :xs="24"
          :sm="24"
          :md="6"
          :lg="6"
          :xl="6"
      >
        <div class="home-card-item mb15 setting">
          <div class="home-card-item-title">技术栈</div>
          <div class="home-card-item-content  p-20">
            <div style="width: 100%">
              <VueUiDonut
                  :dataset="dataset3"
                  :config="config3"
              />
            </div>
=======
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="home-card-item mb15">
          <div class="home-card-item-title">月收入</div>
          <div class="home-card-item-content" style="padding: 20px">
            <div ref="incomeChartRef" style="width: 100%; height: 400px"></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="home-card-four">
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <div class="home-card-item mb15">
          <div class="home-card-item-title">支付方式</div>
          <div class="home-card-item-content" style="padding: 20px">
            <div ref="paymentChartRef" style="width: 100%; height: 400px"></div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <div class="home-card-item mb15">
          <div class="home-card-item-title">待售后</div>
          <div class="home-card-item-content">
            <el-table :data="state.afterSalesData" style="width: 100%">
              <el-table-column prop="orderNo" label="订单id" width="120" />
              <el-table-column prop="phone" label="购买方式" />
              <el-table-column prop="area" label="购买方式" />
              <el-table-column prop="price" label="购买价格" />
              <el-table-column prop="freight" label="快递信息" />
              <el-table-column prop="paymentTime" label="购买时间" />
              <el-table-column prop="isRefund" label="是否退款" />
              <el-table-column label="操作">
                <template #default>
                  <el-button type="primary" link>详情查看</el-button>
                </template>
              </el-table-column>
            </el-table>
>>>>>>> eadc6d673a4b0e53f3c3decb20c14aae2f3768c5
          </div>
        </div>
      </el-col>
      <Auth :value="'docAdmin:docUser:list'">
        <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <div class="home-card-item mb15">
            <div class="home-card-item-title">用户分析</div>
            <div
                v-infinite-scroll="load"
                style="height: 450px; overflow-y: auto"
                class="home-card-item-content flex-col justify-between"
            >
              <div
                  v-for="(v, k) in state.docUserData.data"
                  :key="k"
                  class="item-content-term flex justify-between"
              >
                <div class="flex">
                  <div class="user flex-col justify-between">
                    <div class="f-18">{{ v.nickname }}</div>
                    <div class="f-14 mt-10">
                      最后登录日期：
                      <span style="color: #858585">{{ v.mtime }}</span>
                    </div>
                  </div>
                </div>
                <div class="f-14" :style="{color:v.type==='vip'? '#f5a54b':'#858585'}">
                  {{ v.type === 'vip' ? 'VIP会员' : '普通会员' }}
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </Auth>

    </el-row>
<<<<<<< HEAD

    <!--添加项目-->
    <el-dialog
        :title="state.eventDialog.title"
        v-model="state.eventDialog.isShowDialog"
        width="30vw"
        :close-on-click-modal="false"
    >
      <el-form
          ref="deptDialogFormRef"
          :model="state.eventDialog.ruleForm"
          size="default"
          label-width="100px"
      >
        <el-form-item v-show="false" label="主键ID" prop="id">
          <el-input v-model="state.eventDialog.ruleForm.id" placeholder="主键ID"></el-input>
        </el-form-item>
        <el-form-item label="项目名称" prop="configName">
          <el-input
              v-model="state.eventDialog.ruleForm.configName"
              placeholder="项目名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目图标" prop="configValue">
          <fast-img
              v-model="state.eventDialog.ruleForm.configValue as string"
              :fileUrl="String(state.eventDialog.ruleForm.configValue)"
          />
        </el-form-item>
        <el-form-item label="跳转地址" prop="remark">
          <el-input type="textarea" v-model="state.eventDialog.ruleForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="state.eventDialog.isShowDialog = false" size="default">取 消</el-button>
        <el-button type="primary" @click="onSubmit" size="default">
          {{ state.eventDialog.submitTxt }}
        </el-button>
      </template>
    </el-dialog>

    <el-drawer
        v-model="state.noticeDrawer"
        title="系统公告"
        direction="rtl"
        size="50%"
    >
      <div class="p-10">
        <h2 class="text-center">{{state.notice.title}}</h2>
        <div class="flex m-20 pt-20" v-html="state.notice.content"></div>
      </div>
    </el-drawer>
=======
>>>>>>> eadc6d673a4b0e53f3c3decb20c14aae2f3768c5
  </div>
</template>

<script setup lang="ts" name="homeinfo">
<<<<<<< HEAD
import {reactive, onMounted, ref, watch, nextTick, onActivated, markRaw} from 'vue';
import {formatAxis} from '/@/utils/formatTime';
import {useUserInfo} from '/@/stores/userInfo';
import {storeToRefs} from 'pinia';
import {noticeApi} from '/@/views/system/notice';
import {homeApi} from '/@/views/system/home';
import {ElMessage} from 'element-plus';
import {useRoute, useRouter} from 'vue-router';
import FastImg from '/@/components/fast-upload/img.vue';
import {generateUUID} from '/@/utils/mms';
import {sysConfigApi} from '/@/views/system/config';
import {FunctionType} from '/@/views/system/menu/type';
import {RowSysConfigType} from '/@/views/system/config/type';
import "vue-data-ui/style.css";
import {
  VueDataUi,
  VueUiDonut
} from 'vue-data-ui';
import Auth from '/@/components/auth/auth.vue';
import {auth, auths, authAll} from '/@/utils/authFunction';
import SvgIcon from "/@/components/svg-icon/src/svg-icon.vue";
import {NoticeEntity} from "/@/views/system/notice/type";
// https://vue-data-ui.graphieros.com/ 轻量图表
import { config1,config2,config3,dataset1,dataset2,dataset3 } from "./data"
import {DocUserVo} from "/@/views/system/home/type";

const baseApiConfig = sysConfigApi();
const stores = useUserInfo();
const {userInfos} = storeToRefs(stores);
const router = useRouter();
const baseApi = homeApi();
const baseApiNotice = noticeApi();

const onAuthClick = () => {
  if (!auth('docAdmin:docUser:list')) ElMessage.error('抱歉，您没有权限！');
  else ElMessage.success('恭喜，您有权限！');
};

// 引入组件
const Animate = defineAsyncComponent(() => import('/@/components/animate/index.vue'));
const ruleForm = reactive<RowSysConfigType>({
  id: '',
  configName: '',
  configKey: generateUUID(),
  configValue: '',
  configType: 3,
  columnName: '',
  remark: '',
  status: 1,
  sort: 0,
  revision: 0,
});
const state = reactive({
  noticeDrawer: false,
  notice: {} as NoticeEntity,
  //MMS用户列表
  docUserData: {
    data: [] as DocUserVo[],
    total: 0,
    loading: false,
    param: {
      pageNum: 1,
      pageSize: 10,
    },
  },
  //系统信息
  systemData: {
    userName: '',
    week: '',
    userTool: 0,
    newsTool: 0,
    task: '0/0',
    systemInfo: {
      name: '',
      version: '',
      docUrl: '',
      describe: '',
    },
    fastList: [],
    eventList: [],
  } as {
    userName: string;
    week: string;
    userTool: number;
    newsTool: number;
    task: string;
    systemInfo: {
      name: string;
      version: string;
      docUrl: string;
      describe: string;
    };
    fastList: Array<FunctionType>;
    eventList: Array<any>;
  },
  //添加项目
  eventDialog: {
    isShowDialog: false,
    type: '',
    title: '项目添加',
    submitTxt: '添加',
    ruleForm: ruleForm,
  },
  sysNoticeData: [] as Array<NoticeEntity>,
});


// 当前时间提示语
const currentTime = computed(() => {
  return formatAxis(new Date());
});
/**
 * 到底触发
 */
const load = () => {
  state.docUserData.param.pageNum += 1;
  getUserList();
};
const openWindow = (url: string) => {
  // 确保在客户端环境且 url 存在
  if (typeof window !== 'undefined' && url) {
    window.open(url, '_blank');
  } else {
    ElMessage.error('当前环境不支持 window.open 或 URL 未定义');
    // 可选：给用户一个提示
  }
};

/**
 * 提交
 */
const onSubmit = () => {
  baseApiConfig.insert(state.eventDialog.ruleForm).then((res) => {
    if (res.code === 200) {
      ElMessage.success('保存成功！');
      state.eventDialog.isShowDialog = false;
      getHomeInfo();
      state.eventDialog.ruleForm.configValue = '';
      state.eventDialog.ruleForm.configName = '';
      state.eventDialog.ruleForm.remark = '';
      state.eventDialog.ruleForm.configKey = generateUUID();
    }
  });
};
/**
 * 获取用户列表
 */
const getUserList = () => {
  if (!auth('docAdmin:docUser:list')) return;
  baseApi
      .list(state.docUserData.param)
      .then((res) => {
        state.docUserData.data = state.docUserData.data.concat(res.rows);
        state.docUserData.total = res.total;
      })
      .catch(async (err) => {
        ElMessage.warning(err);
      })
      .finally(() => {
      });
};
/**
 * 系统信息
 */
const getHomeInfo = () => {
  baseApi
      .homeInit()
      .then((res) => {
        state.systemData = res.data;
      })
      .catch(async (err) => {
        ElMessage.warning(err);
      })
      .finally(() => {
      });
};
/**
 * 系统公告
 */
const getNoticeList = () => {
  baseApiNotice
=======
  import { reactive, onMounted, ref, nextTick } from 'vue';
  import { formatAxis } from '/@/utils/formatTime';
  import { useUserInfo } from '/@/stores/userInfo';
  import { storeToRefs } from 'pinia';
  import { useRoute, useRouter } from 'vue-router';
  import { ElMessage } from 'element-plus';
  import { noticeApi } from '/@/api/system/notice';
  import { homeApi } from '/@/api/system/home';
  import * as echarts from 'echarts';
  import type { EChartsOption } from 'echarts';

  const stores = useUserInfo();
  const { userInfos } = storeToRefs(stores);
  const route = useRoute();
  const router = useRouter();
  const baseApi = homeApi();
  const baseApiNotice = noticeApi();

  const incomeChartRef = ref<HTMLDivElement>();
  const paymentChartRef = ref<HTMLDivElement>();

  interface StatsData {
    todayOrders: number;
    ordersChange: number;
    todayUsers: number;
    usersChange: number;
    todayAfterSales: number;
    afterSalesChange: number;
    todaySales: number;
    salesChange: number;
    totalRevenue: number;
    revenueChange: number;
    totalUsers: number;
    totalUsersChange: number;
  }

  interface QuickMenu {
    name: string;
    icon: string;
    path: string;
    color: string;
  }

  interface NoticeEntity {
    id?: string;
    title: string;
    content?: string;
    createTime?: string;
  }

  interface AfterSalesData {
    orderNo: string;
    phone: string;
    area: string;
    price: string;
    freight: string;
    paymentTime: string;
    isRefund: string;
  }

  const state = reactive({
    // 统计数据
    statsData: {
      todayOrders: 12138,
      ordersChange: 25,
      todayUsers: 12138,
      usersChange: 46,
      todayAfterSales: 112138,
      afterSalesChange: 0,
      todaySales: 121388,
      salesChange: 4023,
      totalRevenue: 1213888,
      revenueChange: 1,
      totalUsers: 256388,
      totalUsersChange: 12,
    } as StatsData,
    // 快捷菜单
    quickMenuData: [
      { name: '角色列表', icon: 'ele-Menu', path: '/system/role', color: '#409eff' },
      { name: '生成代码', icon: 'ele-Picture', path: '/system/generate', color: '#2dac34' },
      { name: '系统设置', icon: 'ele-Setting', path: '/system/config', color: '#ff8c00' },
      { name: '系统部门', icon: 'ele-OfficeBuilding', path: '/system/dept', color: '#9c27b0' },
      { name: '系统公告', icon: 'ele-ChatDotSquare', path: '/system/notice', color: '#00bcd4' },
    ] as QuickMenu[],
    // 系统公告
    sysNoticeData: [] as NoticeEntity[],
    // 待售后数据
    afterSalesData: [
      {
        orderNo: '王大豪',
        phone: '15100001234',
        area: '王者荣耀地区',
        price: '￥699.00',
        freight: '￥35.00',
        paymentTime: '2026-01-08',
        isRefund: '详情查看',
      },
      {
        orderNo: '王大豪',
        phone: '15100001234',
        area: '王者荣耀地区',
        price: '￥699.00',
        freight: '￥35.00',
        paymentTime: '2026-01-08',
        isRefund: '详情查看',
      },
      {
        orderNo: '王大豪',
        phone: '15100001234',
        area: '王者荣耀地区',
        price: '￥699.00',
        freight: '￥35.00',
        paymentTime: '2026-01-08',
        isRefund: '详情查看',
      },
      {
        orderNo: '王大豪',
        phone: '15100001234',
        area: '王者荣耀地区',
        price: '￥699.00',
        freight: '￥35.00',
        paymentTime: '2026-01-08',
        isRefund: '详情查看',
      },
    ] as AfterSalesData[],
  });

  // 页面加载时
  onMounted(() => {
    getNoticeList();
    nextTick(() => {
      initIncomeChart();
      initPaymentChart();
    });
  });

  /**
   * 初始化月收入曲线图
   */
  const initIncomeChart = () => {
    if (!incomeChartRef.value) return;

    const chart = echarts.init(incomeChartRef.value);
    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        data: ['订单总数', '订单数量'],
        right: '5%',
        top: '0',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['01/01', '01/02', '01/03', '01/04', '01/05', '01/06', '01/07', '01/08', '01/09', '01/10', '01/11', '01/12', '01/13', '01/14', '01/15'],
        axisLine: {
          lineStyle: {
            color: '#e0e0e0',
          },
        },
        axisLabel: {
          color: '#666',
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '100(万元)',
          position: 'left',
          axisLine: {
            lineStyle: {
              color: '#409eff',
            },
          },
          axisLabel: {
            color: '#666',
          },
          splitLine: {
            lineStyle: {
              color: '#f5f5f5',
            },
          },
        },
        {
          type: 'value',
          name: '(笔)100',
          position: 'right',
          axisLine: {
            lineStyle: {
              color: '#2dac34',
            },
          },
          axisLabel: {
            color: '#666',
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: '订单总数',
          type: 'line',
          smooth: true,
          yAxisIndex: 0,
          data: [40, 50, 60, 50, 69, 50, 40, 50, 30, 50, 60, 50, 60, 70, 60],
          lineStyle: {
            color: '#409eff',
            width: 2,
          },
          itemStyle: {
            color: '#409eff',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
              { offset: 1, color: 'rgba(64, 158, 255, 0.05)' },
            ]),
          },
        },
        {
          name: '订单数量',
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          data: [60, 40, 30, 40, 20, 40, 50, 60, 70, 60, 50, 60, 40, 30, 40],
          lineStyle: {
            color: '#2dac34',
            width: 2,
          },
          itemStyle: {
            color: '#2dac34',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(45, 172, 52, 0.3)' },
              { offset: 1, color: 'rgba(45, 172, 52, 0.05)' },
            ]),
          },
        },
      ],
    };

    chart.setOption(option);

    // 响应式
    window.addEventListener('resize', () => {
      chart.resize();
    });
  };

  /**
   * 初始化支付方式饼图
   */
  const initPaymentChart = () => {
    if (!paymentChartRef.value) return;

    const chart = echarts.init(paymentChartRef.value);
    const option: EChartsOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        bottom: '5%',
        left: 'center',
      },
      series: [
        {
          name: '支付方式',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            position: 'outside',
            formatter: '{d}%',
            fontSize: 14,
            fontWeight: 'bold',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 82, name: '支付宝', itemStyle: { color: '#409eff' } },
            { value: 18, name: '微信', itemStyle: { color: '#2dac34' } },
          ],
        },
      ],
    };

    chart.setOption(option);

    // 响应式
    window.addEventListener('resize', () => {
      chart.resize();
    });
  };
  /**
   * 系统公告
   */
  const getNoticeList = () => {
    baseApiNotice
>>>>>>> eadc6d673a4b0e53f3c3decb20c14aae2f3768c5
      .list({
        pageNum: 1,
        pageSize: 10,
      })
      .then((res) => {
        state.sysNoticeData = res.rows;
      })
      .catch(async (err) => {
        ElMessage.warning(err);
      })
      .finally(() => {
      });
};

// 页面加载时
onMounted(() => {
  getHomeInfo();
  getUserList();
  getNoticeList();
});
</script>

<style scoped lang="scss">
<<<<<<< HEAD
$homeNavLengh: 8;
:deep(.vue-ui-sparkline-title) {
  height: 1rem !important;
}

.home-container {
  overflow: hidden;

  .home-card-one,
  .home-card-two,
  .home-card-three {
    .home-card-item {
      border-radius: 4px;
      transition: all ease 0.3s;
      overflow: hidden;
      background: var(--el-color-white);
      color: var(--el-text-color-primary);
      border: 1px solid var(--next-border-color-light);

      &:hover {
        box-shadow: 0 2px 12px var(--next-color-dark-hover);
        transition: all ease 0.3s;
      }

      &-icon {
        width: 70px;
        height: 70px;
        border-radius: 100%;
        flex-shrink: 1;

        i {
          color: var(--el-text-color-placeholder);
        }
      }

      &-title {
        font-size: 15px;
        font-weight: bold;
        height: 30px;
      }
    }
=======
  .home-container {
    overflow: hidden;
    // 统计卡片
    .home-card-stats {
      .stat-card {
        padding: 20px;
        background: var(--el-color-white);
        border-radius: 8px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        transition: all 0.3s;
        min-height: 120px;
        margin-bottom: 15px;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
        }

        .stat-card-header{
          display: flex;
          align-items: flex-end;
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          flex-shrink: 0;
        }

        .stat-label {
            font-size: 14px;
            color: #333;
            font-weight: 500;
            margin-bottom: 2px;
          }

          .stat-subtitle {
            font-size: 12px;
            color: #999;
            margin-bottom: 8px;
          }

        .stat-content {
          .stat-value {
            font-size: 26px;
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
          }

          .stat-trend {
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 4px;

            &.trend-up {
              color: #FF2D55;
            }

            &.trend-down {
              color: #2dac34;
            }
          }
        }

        &.stat-card-orange .stat-icon {
          background: rgba(255, 140, 0, 0.1);
        }

        &.stat-card-green .stat-icon {
          background: rgba(45, 172, 52, 0.1);
        }

        &.stat-card-blue .stat-icon {
          background: rgba(64, 158, 255, 0.1);
        }

        &.stat-card-purple .stat-icon {
          background: rgba(156, 39, 176, 0.1);
        }

        &.stat-card-red .stat-icon {
          background: rgba(245, 108, 108, 0.1);
        }

        &.stat-card-gray .stat-icon {
          background: rgba(96, 98, 102, 0.1);
        }
      }
    }

    // 卡片通用样式
    .home-card-item {
      background: var(--el-color-white);
      border-radius: 8px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: all 0.3s;

      &:hover {
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
      }

      .home-card-item-title {
        padding: 15px 20px;
        font-size: 16px;
        font-weight: 600;
        border-bottom: 1px solid #f0f0f0;
      }

      .home-card-item-content {
        padding: 20px;
      }
    }

    // 快捷菜单
    .home-card-two {
      .home-card-item {
        height: 245px; 
        display: flex;
        flex-direction: column;

        .home-card-item-title {
          flex-shrink: 0;
        }

        .home-card-item-content {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;

          &.flex {
            flex: 1;
          }
        }

        .quick-menu-item {
          width: 20%;
          padding: 20px 10px;
          transition: all 0.3s;

          &:hover {
            transform: translateY(-5px);

            .quick-menu-icon {
              transform: scale(1.1);
            }
          }

          .quick-menu-icon {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            background: #48A1FA;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
            transition: all 0.3s;
            color: #fff;
          }

          
          .quick-menu-text {
            font-size: 14px;
            color: #333;
          }
        }
        .quick-menu-item:nth-child(2n) {
          .quick-menu-icon {
            background: #45DDB6;
          }
        }
        .notice-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .notice-item {
          padding: 15px 0;
          border-bottom: 1px solid #f0f0f0;

          &:last-child {
            border-bottom: none;
          }

          &:hover {
            background: #f5f7fa;
            padding-left: 10px;
            padding-right: 10px;
            border-radius: 4px;
          }
        }
      }
    }

    // 曲线图
    .home-card-three {
      .home-card-item {
        min-height: 450px;
      }
    }

    // 饼图和表格
    .home-card-four {
      .home-card-item {
        min-height: 500px;

        :deep(.el-table) {
          .el-table__header th {
            background: #f5f7fa;
            font-weight: 600;
          }
        }
      }
    }
>>>>>>> eadc6d673a4b0e53f3c3decb20c14aae2f3768c5
  }

  .home-card-one {
    @for $i from 0 through 3 {
      .home-one-animation#{$i} {
        opacity: 0;
        animation-name: error-num;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
        animation-delay: calc($i/4) + s;
      }
    }
  }

  .home-card-one {
    .home-card-item {
      height: 140px;
      padding: 25px;

      .avatar-box {
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
      }

      .avatar {
        overflow: hidden;

        width: 70px;
        height: 70px;
        border-radius: 50%;
        border: 3px solid #00a8e8;

        el-image {
          width: 100%;
          height: 100%;
        }
      }

      .home-card-item-desc {
        font-size: 1.5rem;
      }

      .home-card-item-term {
        width: 100px;
      }
    }
  }

  .home-card-two {
    .home-card-item {
      width: 100%;
      height: 250px;
      overflow: hidden;

      .home-card-item-title {
        padding-left: 15px;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #e9e9e9;
      }

      .home-card-item-content {
        .item-content-term {
          width: 33.33%;
          height: 100px;

          .desc {
            margin-top: 25%;
          }
        }

        .item-content-terms {
          width: 16.66%;
          height: 100px;
        }
      }
    }
  }

  .home-card-three {
    .home-card-item {
      height: 500px;
      width: 100%;
      overflow: hidden;

      .home-card-item-title {
        padding-left: 15px;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #e9e9e9;
      }

      .home-card-item-content {
        padding: 10px;

        .item-content-term {
          margin-bottom: 15px;
          padding: 10px 15px;
          width: 100%;
          height: 90px;
          border: 1px solid #e9e9e9;
          border-radius: 10px;

          .avatar {
            margin-right: 15px;
          }
        }
      }
    }
  }

  .item-content-event {
    width: 16%;
    margin-top: 10px;
  }
  .system_title {
    font-size: 16px !important;
    font-weight: bolder;
  }
}
</style>
