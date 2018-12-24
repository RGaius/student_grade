<style>
.layout-index {
  position: relative;
  overflow: hidden;
}
.layout-header {
  width: 100%;
  height: 10px;
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
}
.layout-content {
  width: 88%;
  height: auto;
  position: fixed;
  left: 120px;
  /* top: 30px; */
  /* overflow-y: scroll; */
}
.layout-footer {
  position: fixed;
  bottom: 0;
  left: 120px;
  width: 88%;
  height: 40px;
  font-weight: bold;
  /* background-color: black; */
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  color: #464c5b
}
</style>

<template>
  <div class="layout-index">
    <div class="layout-sider">
      <Menu style="width:100%;height:100vh" :theme="theme" active-name="index" @on-select="toPage">
        <MenuItem name="/grade">
          <i class="iconfont icon-79"></i>首页
        </MenuItem>
        <MenuItem name="/data">
          <i class="iconfont icon-table"></i>数据
        </MenuItem>
        <MenuItem name="/setting">
          <i class="iconfont icon-setting"></i>设置
        </MenuItem>
        <MenuItem name="/help">
          <i class="iconfont icon-help"></i>帮助
        </MenuItem>
      </Menu>
    </div>
    <div class="layout-content">
      <router-view></router-view>
    </div>
    <div class="layout-footer">当前文件:{{currentFile}}.xlsx</div>
  </div>
</template>
<script>
import pathModule from 'path'

export default {
  data() {
    return {
      theme: "dark",
      currentFile:''
    }
  },
  created(){
    this.currentFile = pathModule.parse(localStorage.getItem('currentTable')).name
  },
  methods:{
      toPage(name){
          console.log(name)
        this.$router.push({path:name})
      }     
  }
}
</script>
