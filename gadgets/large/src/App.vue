<template>
  <div id="app" @jog-click="onClickJog" @click="onClickJog">
    <div class='header' >
      Eco Challenger
    </div>
    <div class='body'>
      <div class="eco-gauge">
        <div class="eco-bar" :class="ecoGaugeColor" :style="{height:gaugeHeight + '%'}"></div>
      </div>
      <ul>
        <li class="fuel">
          <label> Saved Fuel </label>
          <div :class="savedFuelLabelColor"> {{ecoScore.savedFuel}}{{fuelUnitChar}}</div>
        </li>
        <li class="speed">
          <label> Speed </label>
          <i :class="speedIcon"><div v-if="drivingStatus.speed >= 80"> 80 </div></i>
        </li>
        <li class="rpm" >
          <label> RPM </label>
          <i :class="rpmIcon"> </i>
        </li>
        <li class="brake" >
          <label> Brake </label>
          <i :class="brakeIcon"> </i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const FUEL_UNIT = {'LITER': 'liter', 'GALLON': 'gallon'}
const COLOR = {
  'GREEN': 'green',
  'BLUE': 'blue',
  'YELLOW': 'yellow',
  'ORANGE': 'orange',
  'RED': 'red'
}
const SCORE = {
  'GOOD': 'good',
  'NORMAL': 'normal',
  'BAD': 'bad'
}

export default {
  name: 'gadget',
  data () {
    return {
      aicOrigin: 'http://www.obigo.com/renault/common/eco?filter-name=',
      ecoScore: {
        gauge: 0,
        savedFuel: 0,
        savedMileage: 0,
        extendedMileage: 0,
        ecoExtendedMileage: 0
      },
      drivingStatus: {
        speed: 0,
        brake: 0,
        engineSpeed: 0
      },
      fuelUnit: FUEL_UNIT.LITER
    }
  },
  computed: {
    fuelUnitChar () {
      return this.fuelUnit === 'gallon' ? 'g' : 'L'
    },
    gaugeHeight () {
      return (this.ecoScore.gauge > 99) ? 100 : (this.ecoScore.gauge < 0) ? 0 : this.ecoScore.gauge
    },
    ecoGaugeColor () {
      const score = this.ecoScore.gauge
      if (score >= 76) {
        return COLOR.GREEN
      } else if (score >= 51 && score <= 75) {
        return COLOR.YELLOW
      } else if (score >= 25 && score <= 50) {
        return COLOR.ORANGE
      } else if (score < 25) {
        return COLOR.RED
      }
    },
    savedFuelLabelColor () {
      return this.ecoScore.savedFuel >= 0 ? COLOR.GREEN : COLOR.RED
    },
    speedIcon () {
      const speed = this.drivingStatus.speed
      if (speed < 80) {
        return SCORE.GOOD
      } else if (speed >= 100) {
        return SCORE.BAD
      } else {
        return SCORE.NORMAL
      }
    },
    rpmIcon () {
      const rpm = this.drivingStatus.engineSpeed
      if (rpm < 2500) {
        return SCORE.GOOD
      } else if (rpm >= 3200) {
        return SCORE.BAD
      } else {
        return SCORE.NORMAL
      }
    },
    brakeIcon () {
      const brake = this.drivingStatus.brake
      const speed = this.drivingStatus.speed
      if (speed < 5) {
        return SCORE.GOOD
      }
      if (brake < 41) {
        return SCORE.GOOD
      } else if (brake >= 61) {
        return SCORE.BAD
      } else {
        return SCORE.NORMAL
      }
    }
  },
  mounted () {
    if (window.applicationFramework) {
      this.application = window.applicationFramework.applicationManager.getOwnerApplication(window.document)
      // init application inter communication
      const aicMessage = ['ECO_REQ_INIT_DATA', 'ECO_RES_INIT_DATA', 'ECO_UPDATE_UNIT', 'ECO_UPDATE_DRIVING_STATUS']
      aicMessage.map((id) => {
        this.application.registerMessageListener(id)
      })
      this.application.addEventListener('ApplicationMessage', this.onAICEventHandler, false)
      this.application.postMessage('NULL', this.aicOrigin + 'ECO_REQ_INIT_DATA', null)

      this.application.addEventListener('ApplicationShown', () => {
        this.application.postMessage('NULL', this.aicOrigin + 'ECO_REQ_INIT_DATA', null)
      }, false)
      this.application.addEventListener('ApplicationHidden', () => {
        this.$focus.exitFocusMode()
      }, false)
    }
  },
  methods: {
    onAICEventHandler (msg, origin) {
      const filterName = (origin.indexOf('filter-name=') > -1) ? origin.slice(origin.indexOf('filter-name=') + 12) : ''
      let data
      switch (filterName) {
        case 'ECO_RES_INIT_DATA':
          data = JSON.parse(msg)
          this.ecoScore = data.ecoScore
          break
        case 'ECO_UPDATE_UNIT':
          this.fuelUnit = JSON.parse(msg).fuel
          break
        case 'ECO_UPDATE_DRIVING_STATUS':
          data = JSON.parse(msg)
          this.drivingStatus = data.drivingStatus
          break
        default:
          break
      }
    },
    onClickJog () {
      this.$focus.exitFocusMode()
      this.application.fullscreen()
    }
  }
}
</script>

<style lang='scss'>
  @import '../../../src/style/colors.scss';
  @mixin obg-icon-svp-rpm{background:url('./assets/image/svp_49x49.png') no-repeat -294px 0;}
  @mixin obg-icon-svp-brake{background:url('./assets/image/svp_49x49.png') no-repeat -343px 0;}
  @mixin obg-icon-svp-check{background:url('./assets/image/svp_49x49.png') no-repeat -245px 0;}
  body {
    font-family:'ReadCondensed-Regular';
    margin:0;
    background-color: #111;
  }
#app {
  position: relative;
  width: 390px;
  height: 362px;
  background:#333;
  color: #ffffff;
  font-family:'ReadCondensed-Regular';
  font-size:35px;
  > div {
    position: relative;
  }
  > .header {
    height: 40px;
    display: flex;
    align-items: center;
    text-indent: 10px;
    font-size:32px;
  }
  > .body {
    height: 243px;
    color:$grey;
    &.obg-focus{
      box-shadow: inset 0 0 0 5px #fff;
    }
    & > .eco-gauge{
      position:relative;
      width:50px;
      height:240px;
      overflow:hidden;
      background: $grey2;
      margin: 40px 20px 40px 20px;
      float: left;
      border: 1px solid #aaa;
      & > .eco-bar{
        width: 50px;
        bottom: 0px;
        position: absolute;
        -webkit-transition: height 0.3s;
        background:  -webkit-linear-gradient(left, $yellow2, $green2);
        &.green{
          background:  -webkit-linear-gradient(left, $yellow2, $green2);
        }
        &.blue{
          background:  -webkit-linear-gradient(left, $blue, $blue2);
        }
        &.yellow{
          background:  -webkit-linear-gradient(left, $yellow, $yellow3);
        }
        &.orange{
          background:  -webkit-linear-gradient(left, $orange2, $orange3);
        }
        &.red{
          background:  -webkit-linear-gradient(left, $red2, $red3);
        }
      }
    }
    & > ul {
      height: 240px;
      width: 260px;
      margin: 40px 10px 40px 10px;
      float: left;
      & > li {
        height: 60px;
        line-height: 60px;
        display:flex;
        & > label{
          width: 160px;
          text-align: left;
          margin-right: 20px;
        }
        & > i {
          display:inline-block;
          width:50px;
          height:50px;
          border-radius: 25px;
          margin-left: 13px;
          &.good{
            background-color: $green !important;
            @include obg-icon-svp-check;
          }
          &.normal, &.bad{
            @include obg-icon-svp-brake;
          }
          &.normal{
            background-color: $yellow !important;
          }
          &.bad{
            background-color: $red !important;
          }
        }
        &.rpm{
          > i {
            &.normal, &.bad{
              @include obg-icon-svp-rpm;
            }
          }
        }
        &.fuel{
          & > div{
            width: 80px;
            text-align: center;
            &.green{
              color:$green;
            }
            &.red{
              color:$red;
            }
          }
        }
        &.speed{
          & > i{
            &.good {
              @include obg-icon-svp-check;
            }
            &.normal, &.bad {
              background-image: none !important;
            }
            & > div {
              width: 50px;
              height: 50px;
              text-align: center;
              line-height: 47px;
              color: black;
            }
          }
        }
        &.rpm{

        }
        &.brake{

        }
      }
    }
  }
}
@media renault9p {
  #app {
    width: 396px;
    height: 390px;
    .cover {
      width: 396px;
      height: 390px;
    }
    .body {
      height: 264px;
      > div {
        margin-bottom: 40px;
      }
    }
  }
}
</style>
