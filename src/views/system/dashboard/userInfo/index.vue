<template>
  <div class="home-user-info-container">
    <el-card class="box-card" shadow="hover">
      <div>
        <el-row :gutter="20">
          <el-col :span="2">
            <div class="div-avatar">
              <img :src="userInfo.avatar" class="home-user-avatar"/>
            </div>
          </el-col>
          <el-col :span="22">
            <div class="user-info-header">欢迎回来：
              <router-link to="/user/profile">{{ userInfo.nickName }}</router-link>
            </div>
            <div class="user-info-detail">
              <i class="el-icon-time">上次登录时间：{{ userInfo.loginDate }}</i>
              <i class="el-icon-map-location">上次登录IP：{{ userInfo.loginIp }}</i>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup name="userInfoS">

import {getHomeUserInfo} from "@/api/system/user";
const baseUrl = import.meta.env.VITE_APP_BASE_API;
import defAva from '@/assets/images/photo.png'

const data = reactive({
  userInfo: reactive({
    nickName: undefined,
    loginDate: undefined,
    loginIp:  undefined,
    avatar: undefined,
  }),
});

const { userInfo} = toRefs(data);

function loadUserInfo() {
  getHomeUserInfo().then(response => {
    userInfo.value = response.userInfo;
    userInfo.value.avatar = (userInfo.value.avatar == "" || userInfo.value.avatar == null) ? defAva : import.meta.env.VITE_APP_BASE_API + userInfo.value.avatar;
  })
};

loadUserInfo();

</script>


<style>
.home-user-info-container {
  padding: 10px 0;
}

.home-user-info-container .el-card__body {
  padding: 10px 10px 5px 10px;
}

.home-user-info-container .div-avatar {
  padding: 5px;
  text-align: center;
}

.home-user-info-container .home-user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
}

.home-user-info-container .user-info-header {
  font-size: 16px;
  padding: 12px 0;
  color: #5a5e66;
}

.home-user-info-container .user-info-header a {
  color: #409eff;
}

.home-user-info-container .user-info-detail {
  display: block;
  font-size: 12px;
  color: #909399;
}

.home-user-info-container .user-info-detail i {
  margin-right: 10px;
}
</style>
