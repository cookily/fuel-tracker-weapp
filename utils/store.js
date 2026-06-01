const STORAGE_KEY = 'fuel-consumption-app-state'

function createEmptyState() {
  return {
    currentVehicleId: null,
    vehicles: [],
  }
}

function ensureArray(value) {
  return Array.isArray(value) ? value : []
}

function normalizeRecord(record = {}, index = 0) {
  return {
    id: record.id || `record-${Date.now()}-${index}`,
    date: record.date || '',
    odometerKm: Number(record.odometerKm) || 0,
    fuelLiters: Number(record.fuelLiters) || 0,
    totalCost: Number(record.totalCost) || 0,
    isFullTank: Boolean(record.isFullTank),
    createdAt: Number(record.createdAt) || Date.now() + index,
    segment: record.segment || null,
  }
}

function normalizeVehicle(vehicle = {}, index = 0) {
  return {
    id: vehicle.id || `vehicle-${Date.now()}-${index}`,
    name: vehicle.name || '',
    plateNote: vehicle.plateNote || '',
    fuelType: vehicle.fuelType || '92#汽油',
    tankCapacity: vehicle.tankCapacity === null || vehicle.tankCapacity === ''
      ? null
      : Number(vehicle.tankCapacity) || null,
    records: ensureArray(vehicle.records).map(normalizeRecord),
  }
}

function ensureStateShape(state) {
  const safeState = state && typeof state === 'object' ? state : createEmptyState()
  const vehicles = ensureArray(safeState.vehicles).map(normalizeVehicle)
  const currentVehicleId = vehicles.some((vehicle) => vehicle.id === safeState.currentVehicleId)
    ? safeState.currentVehicleId
    : (vehicles[0] ? vehicles[0].id : null)

  return {
    currentVehicleId,
    vehicles,
  }
}

function loadAppState() {
  try {
    const state = wx.getStorageSync(STORAGE_KEY)
    return state || createEmptyState()
  } catch (error) {
    return createEmptyState()
  }
}

function saveAppState(state) {
  try {
    wx.setStorageSync(STORAGE_KEY, ensureStateShape(state))
    return true
  } catch (error) {
    return false
  }
}

module.exports = {
  STORAGE_KEY,
  createEmptyState,
  ensureStateShape,
  loadAppState,
  saveAppState,
}
