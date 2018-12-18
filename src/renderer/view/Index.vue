<style>
.layout-index {
  /* background: #f5f7f9; */
  position: relative;
  overflow: hidden;
}
.layout-header {
  width: 100%;
  height: 10px;
  /* display: flex;
  flex-direction: column; */
}
.fram-buttom {
  flex: 1;
}
.layout-sider {
  position: fixed;
  left: 0;
  text-align: center;
  width: 120px;
  height: 100vh;
  overflow:auto
  /* background-color: #2d8cf0; */
}
.menu {
  /* background-color: #2d8cf0; */
}
.layout-content {
  width: 100%;
  position: fixed;
  left: 120px;
}
.layout-footer {
  position: fixed;
  bottom: 0;
  left: 120px;
  width: 100%;
  height: 50px;
  background-color: black;
}
</style>

<template>
  <div class="layout-index">
    <div class="layout-sider">
      <Menu style="width:100%;height:100vh" :theme="theme" active-name="1">
        <MenuItem name="1">
          <i class="iconfont icon-79"></i>首页
        </MenuItem>
        <MenuItem name="2">
          <i class="iconfont icon-table"></i>数据
        </MenuItem>
        <MenuItem name="3">
          <i class="iconfont icon-setting"></i>设置
        </MenuItem>
        <MenuItem name="4">
          <i class="iconfont icon-custom-help"></i>帮助
        </MenuItem>
      </Menu>
    </div>
    <div class="layout-content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      theme: "dark"
    };
  }
};
</script>
