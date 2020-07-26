import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  data () {
    return {
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              min: 0,
              max: 100
            },
            gridLines: {
              display: true
            }
          }],
          xAxes: [{
            type: 'time',
            time: {
              unit: 'minute'
            },
            distribution: 'linear',
            gridLines: {
              display: false
            }
          }]
        },
        legend: {
          display: false
        },
        maintainAspectRatio: false,
        responsive: true
      }
    }
  },
  mounted () {
    // this.chartData is created in the mixin and contains all the data needed to build the chart.
    this.renderChart(this.chartData, this.options)
  }
}
