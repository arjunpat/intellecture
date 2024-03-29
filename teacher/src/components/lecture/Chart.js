import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],

  props: {
    chartData: { type: Object, required: true },
    showLegend: { type: Boolean, default: false },
  },

  data() {
    return {
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              min: 0,
              max: 100,
              fontFamily: "Poppins",
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
            },
            ticks: {
              fontFamily: "Poppins",
            }
          }]
        },
        legend: {
          display: this.showLegend
        },
        maintainAspectRatio: false,
        responsive: true,
      }
    }
  },
  mounted() {
    // this.chartData is created in the mixin and contains all the data needed to build the chart.
    this.renderChart(this.chartData, this.options)
  }
}
