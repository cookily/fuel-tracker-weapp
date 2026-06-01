const { recalculateVehicle, buildVehicleStats, sortRecords } = require('./calculations')

function getAppInstance() {
  return getApp()
}

function getState() {
  return getAppInstance().getState()
}

function saveState(nextState) {
  return getAppInstance().setState(nextState)
}

function getVehicles() {
  return getState().vehicles
}

function getCurrentVehicle() {
  const state = getState()
  return state.vehicles.find((vehicle) => vehicle.id === state.currentVehicleId) || null
}

function setCurrentVehicle(vehicleId) {
  const state = getState()
  return saveState({
    ...state,
    currentVehicleId: vehicleId,
  })
}

function upsertVehicle(vehicleInput) {
  const state = getState()
  const incomingVehicle = {
    ...vehicleInput,
    records: vehicleInput.records || [],
  }
  const exists = state.vehicles.some((vehicle) => vehicle.id === incomingVehicle.id)
  const nextVehicles = exists
    ? state.vehicles.map((vehicle) => (vehicle.id === incomingVehicle.id ? incomingVehicle : vehicle))
    : [...state.vehicles, incomingVehicle]

  const nextState = saveState({
    currentVehicleId: state.currentVehicleId || incomingVehicle.id,
    vehicles: nextVehicles,
  })

  return nextState.vehicles.find((vehicle) => vehicle.id === incomingVehicle.id)
}

function removeRecord(vehicleId, recordId) {
  const state = getState()
  const nextVehicles = state.vehicles.map((vehicle) => {
    if (vehicle.id !== vehicleId) {
      return vehicle
    }

    return recalculateVehicle({
      ...vehicle,
      records: vehicle.records.filter((record) => record.id !== recordId),
    })
  })

  return saveState({
    ...state,
    vehicles: nextVehicles,
  })
}

function upsertRecord(vehicleId, recordInput) {
  const state = getState()
  const nextVehicles = state.vehicles.map((vehicle) => {
    if (vehicle.id !== vehicleId) {
      return vehicle
    }

    const exists = vehicle.records.some((record) => record.id === recordInput.id)
    const nextRecords = exists
      ? vehicle.records.map((record) => (record.id === recordInput.id ? recordInput : record))
      : [...vehicle.records, recordInput]

    return recalculateVehicle({
      ...vehicle,
      records: sortRecords(nextRecords),
    })
  })

  return saveState({
    ...state,
    vehicles: nextVehicles,
  })
}

function getVehicleStats(vehicleId) {
  const vehicle = getVehicles().find((item) => item.id === vehicleId)
  return vehicle ? buildVehicleStats(vehicle) : null
}

module.exports = {
  getCurrentVehicle,
  getState,
  getVehicleStats,
  getVehicles,
  removeRecord,
  saveState,
  setCurrentVehicle,
  upsertRecord,
  upsertVehicle,
}
