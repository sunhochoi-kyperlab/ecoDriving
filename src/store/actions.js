/**
 *  @namespace Action creater
 *  @desc commit or dispatch action, do ajax action
 */
import * as types from './actionTypes'

export function updateUnit ({commit}, {fuel, distance}) {
  commit(types.UPDATE_UNIT, {fuel, distance})
}

export function resetData ({commit, state}) {
  let distance
  let drivingTime
  // window.navigator.vehicle.tripMeters.get().then((tripMeters) => {
  //   console.log('reset - tripmeters')
  //   distance = tripMeters[0].distance
  //   window.navigator.vehicle.carConfiguration.getSystemConfiguration().then((config) => {
  //     console.log('reset - time')
  //     drivingTime = config.upTime
  //   })
  //   commit(types.RESET_DATA, {distance: distance, drivingTime: drivingTime})
  // })
  commit(types.RESET_DATA, {distance: distance, drivingTime: drivingTime})
}

export function initStackedDataFromStorage ({commit}, data) {
  commit(types.INIT_DATA_FROM_STORAGE, data)
}

export function setData ({commit}, {ecoScore, trip}) {
  commit(types.SET_DATA, {ecoScore, trip})
}

export function updateVehicleSpeed ({commit}, speed) {
  commit(types.UPDATE_VEHICLE_SPEED, speed)
}

export function updateEngineSpeed ({commit}, speed) {
  commit(types.UPDATE_ENGINE_SPEED, speed)
}

export function updateBrakePressure ({commit}, pressure) {
  commit(types.UPDATE_BRAKE_PRESSURE, pressure)
}

