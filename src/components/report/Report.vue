<template>
  <el-card>
    <!--面包屑导航组件-->
    <my-breadcrumb level1="数据统计" level2="数据报表"></my-breadcrumb>
    <!--echart容器-->
    <div id="main" style="width: 600px;height:400px;"></div>
  </el-card>
</template>
<script>
// 导入echarts
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      option: {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        }
    }
  },
  async mounted() {
    var myChart = echarts.init(document.getElementById('main'))
    const {data: res} = await this.$http.get('reports/type/1')
    if(res.meta.status!==200) return
    // 合并数据。
    const data = _.merge(res.data,this.option)

    myChart.setOption(data)
  }
}
</script>

<style lang='less' scoped>
</style>