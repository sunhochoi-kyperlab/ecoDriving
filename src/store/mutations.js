import * as types from './actionTypes'

export default {
  [types.UPDATE_UNIT] (state, {fuel, distance}) {
    state.unit.fuel = fuel
    state.unit.distance = distance
    postMessage('ECO_UPDATE_UNIT', state.unit)
  },
  [types.INIT_DATA_FROM_STORAGE] (state, data) {
    state.stackTripData = data
  },
  [types.SET_DATA] (state, {ecoScore, trip}) {
    state.ecoScore.gauge = ecoScore.gauge
    state.ecoScore.savedFuel = ecoScore.savedFuel
    state.ecoScore.savedMileage = ecoScore.savedMileage
    state.ecoScore.extendedMileage = ecoScore.extendedMileage
    state.ecoScore.ecoExtendedMileage = ecoScore.ecoExtendedMileage
    state.trip = trip
    postMessage('ECO_RES_INIT_DATA', {'ecoScore': state.ecoScore})
  },
  [types.UPDATE_VEHICLE_SPEED] (state, speed) {
    state.drivingStatus.speed = speed
    postMessage('ECO_UPDATE_DRIVING_STATUS', {'drivingStatus': state.drivingStatus})
  },
  [types.UPDATE_ENGINE_SPEED] (state, speed) {
    state.drivingStatus.engineSpeed = speed
    postMessage('ECO_UPDATE_DRIVING_STATUS', {'drivingStatus': state.drivingStatus})
  },
  [types.UPDATE_BRAKE_PRESSURE] (state, pressure) {
    state.drivingStatus.brake = pressure
    postMessage('ECO_UPDATE_DRIVING_STATUS', {'drivingStatus': state.drivingStatus})
  },
  [types.INIT_START_TRIP_DATA] (state, trip) {
    state.initTripData = trip
  },
  [types.RESET_DATA] (state, {distance, drivingTime}) {
    console.log('reset data trip :' + distance)
    state.initTripData = {
      distance: state.initTripData.distance + state.trip.distance,
      drivingTime: state.initTripData.drivingTime + state.trip.drivingTime
    }
    state.ecoScore = {
      gauge: 0,
      savedFuel: 0,
      savedMileage: 0,
      extendedMileage: 0,
      ecoExtendedMileage: 0
    }
    state.trip = {
      startTime: 0,
      distance: 0,
      drivingTime: 0,
      endTime: 0
    }
    postMessage('ECO_RES_INIT_DATA', {'ecoScore': state.ecoScore})
  }
}

const aicOrigin = 'http://www.obigo.com/renault/common/eco?filter-name='
function postMessage (id, obj) {
  if (window.applicationFramework) {
    window.applicationFramework.applicationManager.getOwnerApplication(window.document).postMessage(JSON.stringify(obj), aicOrigin + id, null)
  }
}
