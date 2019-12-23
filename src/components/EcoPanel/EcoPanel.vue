<template>
  <div class="content">
    <div class="eco-info-top">
        <span class="eco-title">Eco Score</span>
        <router-link to="/setting"><i class="btn-set"></i></router-link>
    </div>
    <div class="eco-info">
      <div class="gauge-area">
          <div class="eco-gauge">
            <svg class="progress" width="200" height="200" viewBox="0 0 200 200" :class="ecoGaugeColor">
                <circle class="progress__meter" cx="100" cy="100" r="85" stroke-width="30" />
                <linearGradient id="linearColors" x1="0" y1="0" x2="0" y2="100%">
                    <stop offset="0%" class="grad1"></stop>
                    <stop offset="100%" class="grad2"></stop>
                </linearGradient>
                <circle class="progress__value" cx="100" cy="100" r="85" stroke="url(#linearColors)" stroke-width="30"
                :style="{'stroke-dasharray': 2 * Math.PI * 85, 'stroke-dashoffset': (2 * Math.PI * 85) * (1 - gaugeHeight / 100)}" />
            </svg>
            <div class="gauge-text">{{gaugeHeight}}<span>/100</span></div>
        </div>
        <div class="speed">
            <span class="name">Speed</span>
            <span class="value">
              {{ getDrivingStatus.speed }}<br/>{{distanceUnit}}/h
            </span>
        </div>
        
        <div class="rpm">
            <span class="name">RPM</span>
            <span class="value">
              {{ getDrivingStatus.engineSpeed }}
            </span>
        </div>

        <div class="brake">
            <span class="name">Brake</span>
            <span class="value">
              {{ getDrivingStatus.brake }}%
            </span>
        </div>
      </div>

      <div class="etc-area">
        <div class="saved-info"> 
            <span class="save-title">You Save</span>
            <div class="extended-mileage">
                <div class="extended-mileage-icon">
                    <i />
                </div>
                <div class="extended-mileage-label">
                    <div class="saved-fuel" :class="savedFuelLabelColor">{{savedFuel}} {{fuelUnit}}</div>

                    <div class="expectation">{{extendedMileage }}</div>
                    <!--<span class="symbol">+</span>-->
                    <div class="eco-expectation">+ {{ecoExtendedMileage}}</div>
                </div>
            </div>
        </div>

        <div class="trip-info">
            <span class="trip-title">Trip Info</span>
            <div class="trip-time">
                <i></i>
                <span>{{drivingTime}}</span>
            </div>
            <div class="trip-distance">
                <i></i>
                <span>{{tripDistance}}</span>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

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

  export default{
    name: 'EcoPanel',
    data () {
      return {
        showInfo: false
      }
    },
    computed: {
      ...mapGetters([
        'getEcoScore',
        'getTrip',
        'getDrivingStatus',
        'getUnit'
      ]),
      maxSpeed () {
        return 80
      },
      ecoGaugeColor () {
        const score = this.getEcoScore.gauge
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
      savedFuel () {
        return (this.getUnit.fuel === 'gallon') ? (this.getEcoScore.savedFuel * 0.264172).toFixed(1) : this.getEcoScore.savedFuel
      },
      savedFuelLabelColor () {
        return this.getEcoScore.savedFuel >= 0 ? COLOR.GREEN : COLOR.RED
      },
      savedMileageLabelColor () {
        return this.getEcoScore.savedMileage >= 0 ? COLOR.GREEN : COLOR.RED
      },
      speedIcon () {
        const speed = this.getDrivingStatus.speed
        if (speed < 80) {
          return SCORE.GOOD
        } else if (speed >= 100) {
          return SCORE.BAD
        } else {
          return SCORE.NORMAL
        }
      },
      gaugeHeight () {
        return (this.getEcoScore.gauge > 99) ? 100 : (this.getEcoScore.gauge < 0) ? 0 : this.getEcoScore.gauge
      },
      tripDistance () {
        const distance = (this.getTrip.distance < 0) ? 0 : this.getTrip.distance
        // return this.meterConvert(distance) // control panel meter인 경우 // TODO
        return this.meterConvert(distance * 1000) // control panel km인 경우
      },
      savedMileage () {
        return this.meterConvert(this.getEcoScore.savedMileage * 1000)
      },
      extendedMileage () {
        return this.meterConvert(this.getEcoScore.extendedMileage * 1000 * 3)
      },
      ecoExtendedMileage () {
        const ecoMile = this.getEcoScore.ecoExtendedMileage * 1000 / 10
        return this.meterConvert((ecoMile < 0 || this.getEcoScore.ecoExtendedMileage === Infinity) ? 0 : ecoMile)
      },
      rpmIcon () {
        const rpm = this.getDrivingStatus.engineSpeed
        if (rpm < 2500) {
          return SCORE.GOOD
        } else if (rpm >= 3200) {
          return SCORE.BAD
        } else {
          return SCORE.NORMAL
        }
      },
      brakeIcon () {
        const brake = this.getDrivingStatus.brake
        const speed = this.getDrivingStatus.speed
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
      },
      distanceUnit () {
        return this.getUnit.distance === 'mile' ? 'mile' : 'km'
      },
      fuelUnit () {
        return this.getUnit.fuel === 'gallon' ? 'g' : 'L'
      },
      drivingTime () {
        const sec = (this.getTrip.drivingTime < 0) ? 0 : this.getTrip.drivingTime
        let date = new Date(null)
        let regex = /^(00)+:[0-5]?\d:[0-5]?\d/
        let timeStr
        date.setSeconds(Math.round(sec))
        timeStr = date.toISOString().substr(11, 8)
        if (regex.exec(timeStr)) {
          return timeStr.substr(3, 6)
        } else {
          return timeStr
        }
      }
    },
    mounted () {

    },
    methods: {
      meterConvert (meter) {
        if (Math.floor(meter) === 0) return (this.getUnit.distance === 'meter') ? '0 km' : '0 mile'
        let distance = meter
        let num = distance / 1000
        if (this.getUnit.distance === 'meter') {
          if (num >= 1) {
            return num.toFixed(1) + ' km'
          } else {
            return distance.toFixed(0) + ' m'
          }
        } else {
          num = num * 0.621371192
          return num.toFixed(1) + ' mile'
        }
      }
    }
  }
</script>
<style lang='scss' scoped>
  @import '../../style/colors.scss';
  @mixin obg-icon-svp-rpm{background:url('../../assets/image/svp_49x49.png') no-repeat -294px 0;}
  @mixin obg-icon-svp-brake{background:url('../../assets/image/svp_49x49.png') no-repeat -343px 0;}
  @mixin obg-icon-svp-check{background:url('../../assets/image/svp_49x49.png') no-repeat -245px 0;}

  .content{
    width: 1154px;
    position: relative;
    .eco-info-top{
        width: 100%;
        padding: 0 0 0 45px;
        height: 108px;
        margin-bottom: 23px;
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        .eco-title{
            font-size: 38px;
            color: #fff;
            font-family: 'NotoSansCJKkr-Medium';
        }
        .btn-set{
           display: block;
           width: 70px;
           height: 70px;
           position: absolute;
           right: 45px;
           top: 20px;
           background: url('../../img/btn_set.png') no-repeat;
           &:active{
               background-position: -70px 0;
           }
        }

    }
    .eco-info {
      display: flex;
      flex-direction: row;
      position: relative;
      &::before{
          content: '';
          display: block;
          width: 1px;
          height: 430px;
          background: #31345f;
          position: absolute;
          left: 518px;
          top: 0;
      }
      .gauge-area{
        width:518px;
        overflow: hidden;
        height: 100%;
        padding: 265px 56px 0 63px;
        > div{
            text-align: center;
            float: left;
            margin-right: 49px;
            &:last-child{
                margin-right: 0;
            }
            &.speed .value{
                background-color: #4b7723;
                color:#fff;
            }
            &.rpm .value{
                background-color: #feb719;
            }
            &.brake .value{
                background-color: #ed0200;
            }
        }
        .name{
            display: block;
            font-size: 28px;
            color: #fff;
        }
        .value{
            font-family: 'NotoSansCJKkr-Medium';
            display: flex;
            width: 100px;
            height: 100px;
            justify-content: center;
            align-items: center;
            margin: 27px auto 0;
            border-radius: 100%;
            font-size: 28px;
        }
      }
      
      .etc-area{
        padding-left: 71px;
        .saved-info{
          .save-title{
              display: block;
              font-size: 33px;
              line-height: 37px;
              color: #fff;
              font-family: 'NotoSansCJKkr-Medium';
          }
          & > .extended-mileage{
            margin-top: 44px;  
            & > .extended-mileage-icon{
              & > i {
                width: 486px;
                height: 81px;
                display: block;
                background:url('../../assets/image/icon_extend_mile.png') no-repeat;
              }
            }
            & > .extended-mileage-label{
              display: flex;
              flex-direction: row;
              font-size: 33px;
              font-family: 'NotoSansCJKkr-Medium';
              text-align: center;
              height: 37px;
              align-items: center;
              margin-top: 17px;
              & > .expectation {
                width: 127px;
                color: #fff;
              }
              & > .symbol{
                font-size: 50px;
                line-height: 32px;
                color: $green;
              }
              & > .eco-expectation {
                color: $green;
                width: 113px;
                text-align: right;
                right: 5px;
              }
              & > .saved-fuel {
                width: 230px;
                &.green{
                color: $green;
                }
                &.red{
                color: $red;
                }
              }
            }
          }
        }
        .trip-info{
          margin-top: 51px;
          overflow: hidden;
          .trip-title{
            display: block;
            font-size: 33px;
            line-height: 37px;
            color: #fff;
            font-family: 'NotoSansCJKkr-Medium';
            margin-bottom: 37px;
          }
          & > div{
          display:flex;
          flex-direction: row;
          align-items: center;
          float: left;
            i{
                display: block;
                width: 50px;
                height: 46px;
                background: url('../../assets/image/icon_trip.png') no-repeat;
                margin-right: 30px;
            }
            & > span{
                font-size: 33px;
                color: #fff;
            }
          }
          .trip-time{
              span{
                  width: 200px;
              }
          }
          .trip-distance{
              i{
                  background-position: -50px 0;
              }
          }
          & > .trip-icons {
            margin-top: 43px;
            text-align: center;
            & > div {
              float:left;
              width: 110px;
              height: 140px;
              & > .name {
                color:$grey;
              }
              & > .icon {
                width: 100%;
                height: 65px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 3px;
                & >i {
                  display: block;
                  width: 50px;
                  height: 50px;
                  background: rgba(10,10,10,0.3);
                  border-radius: 50%;
                }
              }
              & > .icon > i{
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
              &.speed > .icon {
                > span {
                  position: absolute;
                  color: black;
                  font-size: 35px;
                  font-weight: bold;
                  height: 65px;
                  line-height: 74px;
                  width: 50px;
                  text-align: center;
                }
                > i {
                  &.normal, &.bad {
                    background-image: none;
                  }
                }
              }
              &.rpm > .icon > i {
                &.normal, &.bad{
                  @include obg-icon-svp-rpm;
                }
              }
            }

          }
        }
      }
    }
  }
.eco-gauge {
	position: absolute;
    top: 6px;
    left: 163px;
    margin: auto !important;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .gauge-text{
        position: absolute;
        left: 50%;
        top: 50px; 
        transform: translateX(-50%);
        font-family: 'NotoSansCJKkr-Medium';
        font-size: 42px;
        line-height: 51px;
        color: #fff;
        span{
            display: block;
            font-size: 24px;
            line-height: 33px;
        }
    }
}

.progress {
	transform: rotate(-90deg);
    .progress__meter,
    .progress__value {
        fill: none;
    }
    .progress__meter {
        stroke: #1e213f;
    }
    .progress__value {
        stroke-linecap: round;
        -webkit-animation: progress-bar 2s;
    }
    &.green{
        #linearColors{
            .grad1{
                stop-color: #b0e205;
            }
            .grad2{
                stop-color: #4b7723;
            }
        }
    }
    &.yellow{
        #linearColors{
            .grad1{
                stop-color: #fab51a;
            }
            .grad2{
                stop-color: #d27802;
            }
        }
    }
    &.orange{
        #linearColors{
            .grad1{
                stop-color: #fab81b;
            }
            .grad2{
                stop-color: #e63601;
            }
        }
    }
    &.red{
        #linearColors{
            .grad1{
                stop-color: #f10201;
            }
            .grad2{
                stop-color: #931500;
            }
        }
    }
}


@-webkit-keyframes progress-bar {
   0% { stroke-dashoffset: 534.071; }
}
</style>
