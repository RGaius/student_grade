<template>
  <div class="init-layout">
    <Button type="success" shape="circle" long @click="importFile">打开新文件</Button>
    <Button type="primary" shape="circle" long @click="showHistoryFiles">打开历史文件</Button>
    <Drawer title="历史文件列表" placement="left" v-model="show" scrollable=true>
      <Menu active-name="1" @on-select="openHistoryFile">
        <MenuItem v-for="(file,index) of fileList" :name="file" :key="index">
          <i class="iconfont icon-excel"></i>{{file}}
        </MenuItem>
      </Menu>
    </Drawer>
  </div>
</template>
<style>
.init-layout {
  width: 30vw;
  height: 20vh;
  position: fixed;
  left: 35vw;
  top: 40vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-content: center;
}
</style>
<script>
import { ipcRenderer } from "electron"
import { isExcelFile, readExcelFile } from "../utils/ExcelUtil"
import { getTargetDirFiles } from "../utils/FileUtil"
import * as Constants from '../constants/Application'
import os from 'os'

export default {
  data() {
    return {
      show: false,
      fileList:[]
    };
  },
  created() {
    ipcRenderer.once("open-file-response", (event, path) => {
      if (isExcelFile(path)) {
        this.$Spin.show({
          render: h => {
            return h("span", {}, "数据加载中，请稍后...");
          }
        });
        const result = readExcelFile(this, path);
        this.$Spin.hide();
        if (result) {
          this.$Notice.success({
            title: "文件读取成功！"
          });
          this.$router.push({ path: "/index" });
        } else {
          this.$Notice.error({
            title: "文件读取失败！"
          });
        }
      } else {
        this.$Notice.warning({
          title: "文件格式有误"
        });
      }
    });
    this.fileList = []
    const fileList = getTargetDirFiles(os.homedir + Constants.separator + Constants.appDir)
    this.fileList.push(...fileList) 
  },
  methods: {
    showHistoryFiles() {
      this.show = true;
    },
    importFile(e) {
      ipcRenderer.send("sync-openFile-dialog");
    },
    openHistoryFile(file){
        const currentFilePath = os.homedir + Constants.separator + Constants.appDir + Constants.separator + file
        localStorage.setItem('currentTable', currentFilePath)
        this.$router.push({path:'/index'})
    }
  }
};
</script>


