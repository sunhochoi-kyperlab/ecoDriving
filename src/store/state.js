const FUEL_UNIT = {'LITER': 'liter', 'GALLON': 'gallon'}
const DISTANCE_UNIT = {'METER': 'meter', 'MILE': 'mile'}

const state = {
  isLoading: false,
  drivingState: 0,
  networkAvailable: true,
  unit: {
    fuel: FUEL_UNIT.LITER,
    distance: DISTANCE_UNIT.METER
  },
  ecoScore: {
    gauge: 0,
    savedFuel: 0,
    savedMileage: 0,
    extendedMileage: 0,
    ecoExtendedMileage: 0
  },
  trip: {
    startTime: 0,
    distance: 0,
    drivingTime: 0,
    tripMeter: 0,
    endTime: 0
  },
  drivingStatus: {
    speed: 0,
    brake: 0,
    engineSpeed: 0
  },
  stackCurrentTripData: [],
  initTripData: {
    distance: 0,
    drivingTime: 0
  },
  stackTripData: [
    { date: '2017-12-07', hour: 1, speed: 50, rpm: 2089, brake: 10, gauge: 98 },
    { date: '2017-12-07', hour: 2, speed: 50, rpm: 2089, brake: 50, gauge: 91 },
    { date: '2017-12-07', hour: 3, speed: 53, rpm: 2189, brake: 80, gauge: 87 },
    { date: '2017-12-07', hour: 4, speed: 62, rpm: 2321, brake: 40, gauge: 72 },
    { date: '2017-12-07', hour: 5, speed: 81, rpm: 2500, brake: 60, gauge: 52 },
    { date: '2017-12-07', hour: 6, speed: 55, rpm: 2298, brake: 30, gauge: 97 },
    { date: '2017-12-07', hour: 7, speed: 60, rpm: 2507, brake: 10, gauge: 94.8 },
    { date: '2017-12-07', hour: 8, speed: 40, rpm: 1671, brake: 10, gauge: 106 },
    { date: '2017-12-07', hour: 9, speed: 88, rpm: 2900, brake: 10, gauge: 65.8 },
    { date: '2017-12-07', hour: 10, speed: 88, rpm: 2900, brake: 10, gauge: 65.8 },
    { date: '2017-12-07', hour: 11, speed: 30, rpm: 1000, brake: 40, gauge: 108.5 },
    { date: '2017-12-07', hour: 12, speed: 55, rpm: 1400, brake: 10, gauge: 99.5 },
    { date: '2017-12-07', hour: 13, speed: 100, rpm: 2200, brake: 10, gauge: 77.5 },
    { date: '2017-12-07', hour: 14, speed: 99, rpm: 1700, brake: 50, gauge: 88 },
    { date: '2017-12-07', hour: 15, speed: 96, rpm: 2426, brake: 27, gauge: 81.6 },
    { date: '2017-12-07', hour: 16, speed: 80, rpm: 1941, brake: 38, gauge: 98 },
    { date: '2017-12-07', hour: 17, speed: 80, rpm: 1995, brake: 5, gauge: 97.25 },
    { date: '2017-12-07', hour: 18, speed: 70, rpm: 2050, brake: 12, gauge: 99.5 },
    { date: '2017-12-07', hour: 19, speed: 50, rpm: 1850, brake: 15, gauge: 98 },
    { date: '2017-12-07', hour: 20, speed: 90, rpm: 2115, brake: 22, gauge: 87.75 },
    { date: '2017-12-07', hour: 21, speed: 100, rpm: 2400, brake: 25, gauge: 77.5 },
    { date: '2017-12-07', hour: 22, speed: 50, rpm: 2000, brake: 5, gauge: 98 },
    { date: '2017-12-07', hour: 23, speed: 90, rpm: 2715, brake: 35, gauge: 57.75 },
    { date: '2017-12-07', hour: 24, speed: 90, rpm: 2715, brake: 35, gauge: 57.75 }
  ]
}

export default state
