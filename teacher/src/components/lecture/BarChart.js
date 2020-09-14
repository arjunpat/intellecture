import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Bar,
  mixins: [reactiveProp],

  props: {
    chartData: { type: Object, required: true },
    showLegend: { type: Boolean, default: false },
  },

  data() {
    return {
      options: {
        legend: {
          display: this.showLegend
        },
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              min: 0,
            },
            gridLines: {
              display: true
            }
          }]
        },
      }
    }
  },
  mounted() {
    // this.chartData is created in the mixin and contains all the data needed to build the chart.
    this.renderChart(this.chartData, this.options)
  }
}
