<style>
.save-button {
  position: fixed;
  width: 88%;
  display: flex;
  bottom: 10px;
  left:120px;
  flex-direction: row;
  justify-content: space-around;
}
.currentFile{
  height: 32px;
  font-weight: bold;
  text-align: center;
  line-height: 32px;
  font-size: 14px;
  color: #464c5b
}
</style>

<template>
  <div class="grade-layout">
    <Form :model="formItem" :label-width="80" :inline="true">
      <FormItem label="学号">
        <Input v-model="formItem.number" id="number" autofocus @on-change="listenerNumber()" @on-enter="listenerNumber()" placeholder="请输入学生学号"></Input>
      </FormItem>
      <FormItem label="姓名">
        <Input v-model="formItem.name" readonly></Input>
      </FormItem>
    </Form>
    <Table stripe border :columns="columns" :data="tableData" :loading="loading" height="540"></Table>
    <div class="save-button">
      <Button type="success" shape="circle" @click="exportFile">导出文件</Button>
      <div class="currentFile">当前文件:{{currentFile}}.xlsx</div>
      <Button type="primary" shape="circle" @click="updateTable">确认数据</Button>
    </div>
  </div>
</template>
<script>
import * as Constants from '../constants/Application'
import os from 'os'
import pathModule from 'path'
import { ipcRenderer } from 'electron'
import { saveExcelFile} from '../utils/ExcelUtil'

export default {
  data() {
    return {
      loading:false,
      currentFile:'',
      formItem: {
        number: "",
        name: ""
      },
      updateList:[],
      columns: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "项目名称",
          key: "xmmc"
        },
        {
          title: "实验成绩",
          key: "sycj",
          render: (h, params) => {
            return h(
              "Input",
              {
                props: {
                  type: "text",
                  value: this.tableData[params.index].sycj,
                  number:true
                },
                on: {
                  "on-blur": event => {
                    const rsg = /^[1-9]\d(.5)?|100$/
                    const data = event.currentTarget.value
                    console.log(data == '')
                    if(rsg.test(data) || data == '') {
                        let target = []
                        target.push({_id:params.row._id})
                        target.push({sycj: parseInt(data)})
                        this.updateList.push(target)
                    } else{
                        this.$Message.warning('该分数格式有误！'); 
                    }
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
    this.currentFile = pathModule.parse(localStorage.getItem('currentTable')).name
    const _this = this
    ipcRenderer.on("save-file-response",(event,savePath) => {
      if (savePath) {
        saveExcelFile(_this, savePath)
      }
    })
  },
  mounted(){
    ipcRenderer.send("resize-window")
  },
  methods: {
    exportFile(){
        ipcRenderer.send("sync-saveFile-dialog",[localStorage.getItem('currentTable')]);
    },
    toInit(){
        this.$router.push({path:'/'})
    },
    updateTable(){
      if(this.updateList.length > 0) {
          const table = localStorage.getItem('currentTable')
          for (let item of this.updateList) {
              this.$db.updateDocument(table,item[0],item[1])
          }
          this.$Notice.success({
              title: "更新成功"
          });
          this.tableData = []
          this.formItem.number = ''
          this.formItem.name = ''
          document.getElementById('number').lastElementChild.focus()
      } else {
        this.$Notice.info({
              title: "请修改数据后再做更新"
          });
      }  
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

