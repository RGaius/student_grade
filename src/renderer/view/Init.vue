<template>
    <div class="init-layout">
        <Button type="success" shape="circle" long @click="importFile">打开新文件</Button>
        <Button type="primary" shape="circle" long @click="showHistoryFiles">打开历史文件</Button>
        <Drawer title="历史文件列表" placement="left" :closable="false" v-model="show">
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </Drawer>
    </div>
</template>
<style>
    .init-layout{
        width: 30vw;
        height: 20vh;
        position:fixed;
        left:35vw;
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
export default {
    data (){
        return {
            show: false
        }
    },
    created(){
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
        showHistoryFiles(){
            this.show = true
        },
        importFile(e) {
            // ipcRenderer.send("sync-openFile-dialog");
            this.$router.push({path:'/index'})
        }
    }
}
</script>


