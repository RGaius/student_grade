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
      <!-- <FormItem label>
        <Button type="info" shape="circle" @click="getFile">打开文件</Button>
      </FormItem> -->
      <FormItem label>
        <Button type="success" shape="circle" @click="exportFile">导出文件</Button>
      </FormItem>
    </Form>
    <Table stripe border :columns="columns" :data="tableData" :loading="loading"></Table>
    <div class="save-button">
      <Button type="primary" shape="circle" @click="toInit">确认数据</Button>
    </div>
  </div>
</template>
<script>
import * as Constants from '../constants/Application'
import os from "os";

export default {
  data() {
    return {
      loading:false,
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
          key: "xm"
        },
        {
          title: "分数",
          key: "fs",
          render: (h, params) => {
            const _this = this;
            return h(
              "Input",
              {
                props: {
                  type: "text",
                  value: _this.tableData[params.index].fs
                },
                on: {
                  "on-change": event => {
                    this.data[params.index].fs = event.data;
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
    
  },
  methods: {
    exportFile(){
        ipcRenderer.send("sync-saveFile-dialog");
    },
    toInit(){
        this.$router.push({path:'/'})
    },
    listenerNumber() {
      if (this.formItem.number.length == 13) {
        const _this = this;
        this.loading =true
        _this.tableData = []
        _this.$db.findDocument(localStorage.getItem('currentTable'), {
          xh: this.formItem.number
        }).then(function(res) {
          _this.loading = false
            if (res.length == 0) {
                _this.$Notice.warning({
                    title: "未找到对应信息"
                });
            } else {
              _this.formItem.name = res[0].xm
                _this.tableData.push(...res);
            }
        }).catch(function(err){
          _this.loading = false
            _this.$Notice.error({
                title: err
            });
        })
      }
    }
  }
};
</script>

