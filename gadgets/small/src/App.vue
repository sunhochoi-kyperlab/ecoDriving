<template>
  <div id="app" @jog-click="onClickJog" @click="onClickJog">
    <div class='header' >
      Eco Challenger
    </div>
    <div class='body'>
      <div class="fuel">
        <label> Saved Fuel </label>
        <div :class="savedFuelLabelColor"> {{ecoScore.savedFuel}}{{fuelUnitChar}}</div>
      </div>
      <div class="eco-gauge">
        <div class="eco-bar" :class="ecoGaugeColor" :style="{width:gaugeWidth + '%'}"></div>
      </div>
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
        fuelUnit: FUEL_UNIT.LITER
      }
    },
    computed: {
      fuelUnitChar () {
        return this.fuelUnit === 'gallon' ? 'g' : 'L'
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
      gaugeWidth () {
        return (this.ecoScore.gauge > 99) ? 100 : (this.ecoScore.gauge < 0) ? 0 : this.ecoScore.gauge
      },
      savedFuelLabelColor () {
        return this.ecoScore.savedFuel >= 0 ? COLOR.GREEN : COLOR.RED
      }
    },
    mounted () {
      if (window.applicationFramework) {
        this.application = window.applicationFramework.applicationManager.getOwnerApplication(window.document)
        // init application inter communication
        const aicMessage = ['ECO_REQ_INIT_DATA', 'ECO_RES_INIT_DATA', 'ECO_UPDATE_UNIT']
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
        switch (filterName) {
          case 'ECO_RES_INIT_DATA':
            const data = JSON.parse(msg)
            this.ecoScore = data.ecoScore
            break
          case 'ECO_UPDATE_UNIT':
            this.fuelUnit = JSON.parse(msg).fuel
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

<style lang='scss' >
  @import '../../../src/style/colors.scss';
  body {
    font-family:'ReadCondensed-Regular';
    margin:0;
    background-color: #111;
  }
  #app {
    position: relative;
    width: 192px;
    height: 178px;
    background:#666666;
    color: #ffffff;
    font-family:'ReadCondensed-Regular';
    font-size: 30px;
    &.obg-focus{
      box-shadow: inset 0 0 0 4px #fff;
    }
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
      & > .eco-gauge{
        width: 162px;
        height: 50px;
        overflow: hidden;
        margin: 10px 15px 15px 15px;
        background: $grey2;
        border: 1px solid #aaa;
        & > .eco-bar{
          width: 0px;
          height:50px;
          left: 0px;
          -webkit-transition: width 0.3s;
          background:  -webkit-linear-gradient(top, $yellow2, $green2);
          &.green{
            background:  -webkit-linear-gradient(top, $yellow2, $green2);
          }
          &.blue{
            background:  -webkit-linear-gradient(top, $blue, $blue2);
          }
          &.yellow{
            background:  -webkit-linear-gradient(top, $yellow, $yellow3);
          }
          &.orange{
            background:  -webkit-linear-gradient(top, $orange2, $orange3);
          }
          &.red{
            background:  -webkit-linear-gradient(top, $red2, $red3);
          }
        }
      }
      & > .fuel{
        color:$grey;
        width:100%;
        text-align: center;
        & > div{
          &.green{
            color:$green;
          }
          &.red{
            color:$red;
          }
        }
      }
    }
  }
  @media renault9p {
    #app {
      width: 194px;
      height: 191px;
    }
  }
</style>
