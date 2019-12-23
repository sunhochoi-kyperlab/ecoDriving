const INTERVAL = 1000
const METER = 1  // TODO

class TripData {
  constructor () {
    this.$store = null
    this.perSecInterval = null
    this.vehicle = null
    this.vehicleSpeed = 0
    this.engineSpeed = 0
    this.tripMeter = {}
    this.brake = 0
    this.fuel = {}
    this.fuelEfficiency = 3
    this.stack = []
    this.stackInstanceConsumption = 0
    this.lastInstanceConsumption = 0
    this.gatheringData = this.gatheringData.bind(this)
  }
  init ($store) {
    this.vehicle = window.navigator.vehicle
    this.$store = $store

    // init driving status
    this.vehicle.engineSpeed.get().then((engineSpeed) => {
      $store.dispatch('updateEngineSpeed', engineSpeed.speed)
    })
    this.vehicle.vehicleSpeed.get().then((vehicleSpeed) => {
      $store.dispatch('updateVehicleSpeed', vehicleSpeed.speed)
    })
    this.vehicle.brakeOperation.get().then((brake) => {
      $store.dispatch('updateBrakePressure', brake.appliedPressure)
    })

    this.vehicle.engineSpeed.subscribe((e) => {
      $store.dispatch('updateEngineSpeed', e.speed)
      this.engineSpeed = e.speed
    })
    this.vehicle.vehicleSpeed.subscribe((e) => {
      $store.dispatch('updateVehicleSpeed', e.speed)
      this.vehicleSpeed = e.speed
    })
    this.vehicle.brakeOperation.subscribe((e) => {
      $store.dispatch('updateBrakePressure', e.appliedPressure)
      this.brake = e.appliedPressure
    })

    this.vehicle.fuel.get().then((e) => {
      this.fuel = e
    })
    this.vehicle.tripMeters.get().then((e) => {
      this.tripMeter = e.meters[0]
    })
    this.vehicle.fuel.subscribe((e) => {
      this.fuel = e
      this.stackInstanceConsumption += this.fuel.instantConsumption
    })
    this.vehicle.tripMeters.subscribe((e) => {
      this.tripMeter = e.meters[0]
    })

    this.initTripData()

    this.perSecInterval = setInterval(this.gatheringData, INTERVAL)
  }
  initTripData () {
    let trip
    let drivingTime
    this.vehicle.tripMeters.get().then((tripMeters) => {
      trip = tripMeters.meters[0]
      this.vehicle.carConfiguration.getSystemConfiguration().then((config) => {
        drivingTime = config.upTime
        this.$store.commit('INIT_START_TRIP_DATA', {distance: trip.distance, drivingTime: drivingTime})
      })
    })
  }
  resetInterval (interval) {
    clearInterval(this.perSecInterval)
    this.perSecInterval = setInterval(this.gatheringData, interval)
  }
  gatheringData () {
    console.log('gatheringData')
    let speed = this.vehicleSpeed
    let rpm = this.engineSpeed
    let brake = this.brake
    let trip = this.tripMeter
    let fuel = this.fuel
    let drivingTime = 0
    // console.log('start - ' + Date.now())
    // this.vehicle.engineSpeed.get().then((engineSpeed) => {
    //   rpm = engineSpeed.speed
    //   // console.log('get rpm' + rpm)
    //   // this.$store.dispatch('updateEngineSpeed', rpm)
    //   this.vehicle.vehicleSpeed.get().then((vehicleSpeed) => {
    //     speed = vehicleSpeed.speed
    //     // console.log('get speed ' + speed)
    //     // this.$store.dispatch('updateVehicleSpeed', vehicleSpeed.speed)
    //     this.vehicle.fuel.get().then((fuelOperation) => {
    //       fuel = fuelOperation
    //       // console.log('get fuel ' + fuel)
    //       this.vehicle.brakeOperation.get().then((brakeOperation) => {
    //         brake = brakeOperation.appliedPressure
    //         // console.log('get brake ' + brake)
    //         this.vehicle.tripMeters.get().then((tripMeters) => {
    //           trip = tripMeters.meters[0]
    //           // console.log('get trip ' + trip.distance)
    //           this.vehicle.carConfiguration.getSystemConfiguration().then((config) => {
    //             drivingTime = config.upTime
    //             // console.log('get drivingTime ' + drivingTime)
    //           })
    //             .then(() => {
    //               // this.vehicle.brakeOperation.get().then((brake) => {
    //               //   this.$store.dispatch('updateBrakePressure', brake.appliedPressure)
    //               // })
    //               if (this.lastInstanceConsumption !== fuel.instantConsumption) this.stackInstanceConsumption += fuel.instantConsumption
    //
    //               const initTripData = this.$store.state.initTripData
    //               const gauge = this.calcEcoGauge({speed, rpm, brake})
    //               const ecoValue = this.calcEcoValue({trip, fuel, initTripData})
    //               console.log('trip distance -' + trip.distance)
    //               console.log('initTripData distance -' + initTripData.distance)
    //               if (trip.distance - initTripData.distance < 0 || drivingTime - initTripData.drivingTime < 0) {
    //                 this.$store.commit('INIT_START_TRIP_DATA', {distance: trip.distance, drivingTime: drivingTime})
    //                 initTripData.distance = trip.distance
    //                 initTripData.drivingTime = drivingTime
    //                 this.stackInstanceConsumption = 0
    //                 this.lastInstanceConsumption = 0
    //               }
    //
    //               const obj = {
    //                 ecoScore: {
    //                   gauge: gauge,
    //                   savedFuel: ecoValue.savedFuel,
    //                   savedMileage: ecoValue.savedMileage,
    //                   extendedMileage: ecoValue.extendedMileage,
    //                   ecoExtendedMileage: ecoValue.ecoExtendedMileage
    //                 },
    //                 trip: {
    //                   distance: trip.distance - initTripData.distance,
    //                   drivingTime: drivingTime - initTripData.drivingTime
    //                 }
    //               }
    //
    //               let date = new Date()
    //               let yyyymmdd = this.getDate(date)
    //               let hour = date.getHours() + 1
    //
    //               if (this.stack.length > 60) {
    //                 this.stack.shift()
    //               }
    //               this.stack.push({date: yyyymmdd, hour: hour, gauge: obj.ecoScore.gauge, drivingStatus: {speed: speed, brake: brake, rpm: rpm}, speed: speed, brake: brake, rpm: rpm})
    //               // console.log(obj)
    //               this.$store.dispatch('setData', obj)
    //               // this.$store.commit('SET_LAST_TRIP_DATA', {
    //               //   tripMeter: trip.distance,
    //               //   drivingTime: drivingTime
    //               // })
    //               // console.log('end - ' + Date.now())
    //             })
    //         })
    //       })
    //     })
    //   })
    // })

    this.vehicle.carConfiguration.getSystemConfiguration().then((config) => {
      drivingTime = config.upTime
      console.log('drivingTime : ' + drivingTime + ' / initTripData.drivingTime : ' + this.$store.state.initTripData.drivingTime)
    })
      .then(() => {
        const initTripData = this.$store.state.initTripData
        const gauge = this.calcEcoGauge({speed, rpm, brake})
        const ecoValue = this.calcEcoValue({trip, fuel, initTripData, speed})

        if (trip.distance - initTripData.distance < 0 || drivingTime - initTripData.drivingTime < 0) {
          this.$store.commit('INIT_START_TRIP_DATA', {distance: trip.distance, drivingTime: drivingTime})
          initTripData.distance = trip.distance
          initTripData.drivingTime = drivingTime
          this.stackInstanceConsumption = 0
          // this.lastInstanceConsumption = 0
        }

        const obj = {
          ecoScore: {
            gauge: gauge,
            savedFuel: ecoValue.savedFuel,
            savedMileage: ecoValue.savedMileage,
            extendedMileage: ecoValue.extendedMileage,
            ecoExtendedMileage: ecoValue.ecoExtendedMileage
          },
          trip: {
            distance: trip.distance - initTripData.distance,
            drivingTime: drivingTime - initTripData.drivingTime
          }
        }

        let date = new Date()
        let yyyymmdd = this.getDate(date)
        let hour = date.getHours() + 1

        if (this.stack.length > 60) {
          this.stack.shift()
        }
        this.stack.push({date: yyyymmdd, hour: hour, gauge: obj.ecoScore.gauge, drivingStatus: {speed: speed, brake: brake, rpm: rpm}, speed: speed, brake: brake, rpm: rpm})
        this.$store.dispatch('setData', obj)
      })
  }
  stopGathering () {
    clearInterval(this.perSecInterval)
  }
  calcEcoGauge ({speed, rpm, brake}) {
    let gauge = 0

    if (speed <= 80) {
      gauge = speed * 1.25
    } else if (speed > 80 && speed <= 130) {
      gauge = 260 - speed * 2
    }

    if (rpm >= 1500 && rpm < 2000) {
      gauge -= (speed * 0.01)
    } else if (rpm >= 2000 && rpm < 2500) {
      gauge -= (speed * 0.03)
    } else if (rpm >= 2500 && rpm < 3000) {
      gauge -= (speed * 0.05)
    } else if (rpm >= 3000) {
      gauge -= (speed * 0.1)
    }

    if (brake >= 0 && brake < 11) {
      gauge -= (speed * 0.02)
    } else if (brake >= 11 && brake < 25) {
      gauge -= (speed * 0.05)
    } else if (brake >= 25 && brake < 45) {
      gauge -= (speed * 0.1)
    } else if (brake >= 45 && brake < 70) {
      gauge -= (speed * 0.2)
    } else if (brake >= 70 && brake <= 100) {
      gauge -= (speed * 0.4)
    }

    return gauge
  }

  calcEcoValue ({trip, fuel, initTripData, speed}) {
    const distance = trip.distance - initTripData.distance// 이동한 거리

    const random = speed <= 15 ? 0 : (Math.random() * (2 - 0 + 0))
    this.fuelEfficiency = 5
    const currentFuelEfficiency = trip.averageConsumption + random// 현재 연비 // trip.averageConsumption
    const calcFuelEfficiency = currentFuelEfficiency - this.fuelEfficiency // 개선된 연비

    let savedFuel = ((distance / METER) / this.fuelEfficiency) - ((distance / METER) / currentFuelEfficiency)
    const savedMileage = savedFuel * calcFuelEfficiency
    let extendedMileage = fuel.level * this.fuelEfficiency // 공인연비
    // const extendedMileage = fuel.level * 5000 / 1000 // 공인연비
    let ecoExtendedMileage = distance === 0 ? 0 : (fuel.level * currentFuelEfficiency) - extendedMileage

    if (isNaN(savedFuel) || savedFuel === Infinity) savedFuel = 0
    if (isNaN(extendedMileage)) extendedMileage = 0
    if (isNaN(ecoExtendedMileage)) ecoExtendedMileage = 0

    return {
      savedFuel: savedFuel.toFixed(1),
      savedMileage: (savedMileage > 1000) ? savedMileage.toFixed(0) : savedMileage,
      extendedMileage: extendedMileage,
      ecoExtendedMileage: ecoExtendedMileage
    }
  }

  resetData () {
    this.stackInstanceConsumption = 0
  }

  secToTime (sec) {
    const timeStr = new Date(sec * 1000).toISOString().substr(11, 8)
    return timeStr
  }

  getDate (date) {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    if (month < 10) month = '0' + month
    let day = date.getDate()
    if (day < 10) day = '0' + day
    return year + '-' + month + '-' + day
  }

  saveData () {
    window.localStorage.setItem('eco-stack-data', this.stack)
  }

  loadData () {
    const data = window.localStorage.getItem('eco-stack-data')
    if (data) {
      this.stack = data
    }
  }

  getData () {
    const length = this.stack.length
    if (length > 0) {
      const sum = this.stack.reduce((pVal, nVal) => { return {speed: pVal.speed + nVal.speed, rpm: pVal.rpm + nVal.rpm, brake: pVal.brake + nVal.brake, gauge: pVal.gauge + nVal.gauge} })

      return {
        date: '2017-12-07',
        hour: this.stack[length - 1].hour,
        speed: sum.speed / length,
        gauge: sum.gauge / length,
        rpm: sum.rpm / length,
        brake: sum.brake / length
      }
    }
    return {
      date: '2017-12-07',
      hour: 12,
      speed: 50,
      gauge: 90,
      rpm: 1200,
      brake: 30
    }
  }
}

const instance = new TripData()

window.tripData = instance

export default instance
