<template>
  <div class="home-container layout-pd">
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
            </div>

            <div>
              <span class="home-card-item-desc">
                {{ currentTime }}，{{ state.systemData.userName }}，开始您一天的工作吧！
              </span>
              <div class="mt10">{{ state.systemData.week }}</div>
            </div>
          </div>
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
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="home-card-two">
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <div class="home-card-item mb15">
          <div class="home-card-item-title">快捷菜单</div>
          <div class="home-card-item-content flex flex-wrap">
            <div
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
            </div>
          </div>
        </div>
      </el-col>
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
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="home-card-three">
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
  </div>
</template>

<script setup lang="ts" name="homeinfo">
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
