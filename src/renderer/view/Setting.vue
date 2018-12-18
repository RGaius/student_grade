<template>
  <Form ref="excelInfo" :label-width="80">
    <FormItem label="学号所在列" prop="number">
      <Input type="text" v-model="excelInfo.number"></Input>
    </FormItem>
    <FormItem label="姓名所在列" prop="name">
      <Input type="text" v-model="excelInfo.name"></Input>
    </FormItem>
    <FormItem label="项目所在列" prop="project">
      <Input type="text" v-model="excelInfo.project"></Input>
    </FormItem>
    <FormItem label="成绩所在列" prop="graden">
      <Input type="text" v-model="excelInfo.graden"></Input>
    </FormItem>
    <FormItem label="学生数据开始行" prop="student">
      <Input type="text" v-model="excelInfo.student"></Input>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="handleSubmit('formCustom')">保存</Button>
      <Button @click="handleReset('formCustom')" style="margin-left: 8px">重置</Button>
    </FormItem>
  </Form>
</template>
<script>
export default {
  data () {
    return {
      excelInfo: {
        number: '',
        name: '',
        project: '',
        fraden: '',
        student: 1
      }
    }
  }
}
</script>

