<template>
  <div class="wrapper">
    <div class="graph-title">
        <span>Eco Score</span>
    </div>
    <div class="graph">
      <canvas ref="chart" width="740px" height="250px"></canvas>
    </div>
    <div class="labels">
      <div class="eco-gauge">
        <i/>
        <span>Eco Gauge</span>
      </div>
      <div class="speed">
        <i/>
        <span>Speed</span>
      </div>
      <div class="rpm">
        <i/>
        <span>RPM</span>
      </div>
      <div class="brake">
        <i/>
        <span>Brake</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import tripData from '../../lib/TripData'
  import Chart from 'chart.js'

  export default{
    name: 'History',
    data () {
      return {
        currentData: {speed: 0, rpm: 0, gauge: 0, brake: 0},
        stackData: {},
        chartData: [],
        data: [],
        ctx: null,
        chart: null,
        chartLabel: []
      }
    },
    computed: {
      ...mapGetters([
        'getStackData'
      ])
    },
    beforeDestroy () {
      this.chart.destroy()
    },
    mounted () {
      // init graph
      this.currentData = tripData.getData()
      this.stackData = this.$store.state.stackTripData

      // const hour = this.currentData.hour
      const hour = 13

      this.data = this.stackData.filter(item => {
        return item.hour < hour
      })
      this.data.push(this.currentData)

      this.createChartData()

      this.ctx = this.$refs.chart
      this.createChart()
    },
    methods: {
      createChartData () {
        const basis = 80 // 하위 3개 값들 기준치
        // const speedMax = 160 // 속도 최고값
        const rpmMax = 8000 // rpm 최고값
        const brakeMax = 100 // 브레이크 최초값
        this.chartData = [[], [], [], []]
        this.data.map(item => {
          const gauge = (item.gauge < 0) ? 0 : (item.gauge > 100) ? 100 : item.gauge
          this.chartData[0].push(gauge)

          let speed = 0
          if (item.speed > 80) {
            speed = basis - (item.speed - 80)
          } else {
            speed = basis - (80 - item.speed)
          }
          this.chartData[1].push(speed)
          // this.chartData[1].push(item.speed)

          let rpm = basis - (basis / rpmMax) * item.rpm
          this.chartData[2].push(rpm)
          // this.chartData[2].push(item.rpm)

          let brake = basis - (basis / brakeMax) * item.brake
          this.chartData[3].push(brake)
          // this.chartData[3].push(item.brake)

          this.chartLabel.push(item.hour + 'h ago')
        })
        this.chartLabel.pop()
        this.chartLabel.reverse()
        this.chartLabel.push('Now')
      },
      createChart () {
        this.chart = new Chart(this.ctx, {
          type: 'line',
          data: {
            // labels: ['12h ago', '9h ago', '6h ago', '3h ago', 'Now'],
            labels: this.chartLabel,
            datasets: [
              {
                label: 'Eco Gauge',
                fill: false,
                backgroundColor: 'rgb(151, 255, 33)',
                borderColor: 'rgb(151, 255, 33)',
                // data: [-10, 20, 30, 10, 20, 30, -40]
                data: this.chartData[0]
              },
              {
                label: 'Speed',
                fill: false,
                backgroundColor: 'rgb(255, 46, 46)',
                borderColor: 'rgb(255, 46, 46)',
                // data: [30, 25, 22, -15, 45, 65, -35]
                data: this.chartData[1]
              },
              {
                label: 'RPM',
                fill: false,
                backgroundColor: 'rgb(61, 142, 255)',
                borderColor: 'rgb(61, 142, 255)',
                // data: [20, -35, 15, 15, -45, 25, -35]
                data: this.chartData[2]
              },
              {
                label: 'Brake',
                fill: false,
                backgroundColor: 'rgb(97, 97, 97)',
                borderColor: 'rgb(97, 97, 97)',
                // data: [90, 35, 15, 15, 45, 25, 35]
                data: this.chartData[3]
              }
            ]
          },
          options: {
            responsive: true,
            animation: {
              duration: 300
            },
            legend: {
              display: false
            },
            title: {
              display: false
            },
            tooltips: {
              display: false
            },
            hover: {
              display: false
            },
            scales: {
              xAxes: [{
                display: true,
                scaleLabel: {
                  display: false
                  // labelString: 'Month'
                }
              }],
              yAxes: [{
                display: true,
                scaleLabel: {
                  display: true
                  // labelString: 'Value'
                }
              }]
            }
          }
        })
      }
    }
  }
</script>
<style lang='scss' scoped>
  @import '../../style/colors.scss';

  .wrapper {
    .graph-title{
        width: 100%;
        padding: 0 0 0 45px;
        height: 114px;
        margin-bottom: 22px;
        position: relative;
        display: flex;
        align-items: center;
        span{
            font-size: 38px;
            color: #fff;
            font-family: 'NotoSansCJKkr-Medium';
        }
    }
    & > .graph {
      width: 1064px !important;
      height: 380px !important;
      background: $grey2;
      position: relative;
      margin-left: 45px;
      touch-action: none;
      pointer-events: none;
    }
    & > .labels {
      width: 1064px;
      position: relative;
      display: flex;
      font-size: 24px;
      color: #fff;
      margin: 11px 0 0 45px;

      & > div {
        display: flex;
        flex-direction: row;
        align-items: center;
        &.eco-gauge{
            margin-right: 540px;
            i {
                background: #7eaf13;
            }
        }
        &.speed{
            margin-right: 29px;
            i {
                background: #ed0200;
            }
        }
        &.rpm{
            margin-right: 25px;
            i {
                background: #00e3f1;
            }
        }
        & > i {
          width: 30px;
          height: 19px;
          display: block;
          margin-right:13px;
        }
        &:nth-child(4) > i {
          background: #8200dd;
        }
      }
    }
  }
</style>
