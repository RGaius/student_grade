<template>
  <div>
    <Form :model="formItem" :label-width="80" :inline= "true">
      <FormItem label="学号">
        <Input v-model="formItem.number" placeholder="请输入学生学号"></Input>
      </FormItem>
      <FormItem label="姓名">
        <Input v-model="formItem.name" readonly></Input>
      </FormItem>
    </Form>
    <Table stripe border :columns="columns" :data="tableData"></Table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formItem: {
        number: '',
        name: ''
      },
      columns: [{
        type: 'index',
        width: 60,
        align: 'center'
      }, {
        title: '项目名称',
        key: 'name'
      }, {
        title: '分数',
        key: 'age',
        render: (h, params) => {
          return h('input', {
            style: {
              height: 'auto',
              width: 'auto',
              border: 'none'
            }
          }, [])
        }
      }],
      tableData: [{
        name: 'John Brown',
        age: 18,
        address: 'New York No. 1 Lake Park',
        date: '2016-10-03'
      }, {
        name: 'Jim Green',
        age: 24,
        address: 'London No. 1 Lake Park',
        date: '2016-10-01'
      }]
    }
  }
}
</script>

