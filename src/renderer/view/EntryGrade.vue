<style>
.save-button {
  position: fixed;
  bottom: 40px;
  right: 30px;
}
</style>

<template>
  <div class="grade-layout">
    <Form :model="formItem" :label-width="80" :inline="true">
      <FormItem label="学号">
        <Input v-model="formItem.number" @on-change="listenerNumber()" placeholder="请输入学生学号"></Input>
      </FormItem>
      <FormItem label="姓名">
        <Input v-model="formItem.name" readonly></Input>
      </FormItem>
      <FormItem label>
        <Button type="info" shape="circle" @click="getFile">打开文件</Button>
      </FormItem>
      <FormItem label>
        <Button type="success" shape="circle">导出文件</Button>
      </FormItem>
    </Form>
    <Table stripe border :columns="columns" :data="tableData"></Table>
    <div class="save-button">
      <Button type="primary" shape="circle">确认数据</Button>
    </div>
  </div>
</template>
<script>
import { ipcRenderer } from "electron";
import { isExcelFile, readExcelFile } from "../utils/ExcelUtil";
import { findDocument } from "../utils/DataStore";

import os from "os";

export default {
  data() {
    return {
      formItem: {
        number: "",
        name: ""
      },
      columns: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "项目名称",
          key: "项目"
        },
        {
          title: "分数",
          key: "分数",
          render: (h, params) => {
            const _this = this;
            return h(
              "Input",
              {
                props: {
                  type: "text",
                  value: _this.tableData[params.index].age
                },
                on: {
                  "on-change": event => {
                    this.data[params.index].age = event.data;
                  }
                },
                size: "large"
              }
            );
          }
        }
      ],
      tableData: []
    };
  },
  created() {
    ipcRenderer.on("open-file-response", (event, path) => {
      if (isExcelFile(path)) {
        this.$Spin.show({
          render: h => {
            return h("span", {}, "数据加载中，请稍后...");
          }
        });
        const result = readExcelFile(path);
        this.$Spin.hide();
        if (result) {
          this.$Notice.success({
            title: "文件读取成功！"
          });
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
  },
  methods: {
    getFile(e) {
      ipcRenderer.send("sync-openFile-dialog");
    },
    listenerNumber() {
      if (this.formItem.number.length == 13) {
        const _this = this;
        findDocument(os.homedir + "\\.StudentGrade" + "\\studentInfo.db", {
          学号: this.formItem.number
        }).then(function(res) {
          _this.tableData.push(...res);
        });
      }
    }
  }
};
</script>

