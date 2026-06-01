function sortRecords(records) {
  return [...records].sort((left, right) => {
    if (left.date !== right.date) {
      return left.date > right.date ? 1 : -1
    }

    return (left.createdAt || 0) - (right.createdAt || 0)
  })
}

function round(value) {
  return Math.round(value * 100) / 100
}

function recalculateVehicle(vehicle) {
  const sortedRecords = sortRecords(vehicle.records || [])
  let lastFullTankRecord = null
  let fuelAccumulator = 0

  const nextRecords = sortedRecords.map((record) => {
    const nextRecord = {
      ...record,
      segment: null,
    }

    fuelAccumulator += Number(nextRecord.fuelLiters) || 0

    if (!nextRecord.isFullTank) {
      return nextRecord
    }

    if (!lastFullTankRecord) {
      lastFullTankRecord = nextRecord
      fuelAccumulator = 0
      return nextRecord
    }

    const distanceKm = Number(nextRecord.odometerKm) - Number(lastFullTankRecord.odometerKm)

    if (distanceKm <= 0) {
      nextRecord.segment = {
        pending: true,
        reason: '里程异常，无法计算',
      }
      return nextRecord
    }

    const segmentFuelLiters = fuelAccumulator
    const fuelPer100Km = (segmentFuelLiters / distanceKm) * 100
    const costPer100Km = ((Number(nextRecord.totalCost) || 0) / distanceKm) * 100

    nextRecord.segment = {
      pending: false,
      distanceKm: round(distanceKm),
      fuelLiters: round(segmentFuelLiters),
      fuelPer100Km: round(fuelPer100Km),
      costPer100Km: round(costPer100Km),
    }

    lastFullTankRecord = nextRecord
    fuelAccumulator = 0
    return nextRecord
  })

  return {
    ...vehicle,
    records: nextRecords,
  }
}

function buildVehicleStats(vehicle) {
  const records = sortRecords(vehicle.records || [])
  const computedSegments = records
    .map((record) => record.segment)
    .filter((segment) => segment && !segment.pending)

  const totalFuelLiters = round(records.reduce((sum, record) => sum + (Number(record.fuelLiters) || 0), 0))
  const totalCost = round(records.reduce((sum, record) => sum + (Number(record.totalCost) || 0), 0))
  const totalDistanceKm = round(computedSegments.reduce((sum, segment) => sum + segment.distanceKm, 0))
  const averageFuelPer100Km = totalDistanceKm > 0
    ? round((computedSegments.reduce((sum, segment) => sum + segment.fuelLiters, 0) / totalDistanceKm) * 100)
    : 0

  const trend = computedSegments.slice(-6).map((segment, index) => ({
    label: `第${computedSegments.length - Math.min(5, computedSegments.length - 1 - index)}段`,
    value: segment.fuelPer100Km,
  }))

  return {
    totalFuelLiters,
    totalCost,
    totalDistanceKm,
    averageFuelPer100Km,
    recordCount: records.length,
    computedCount: computedSegments.length,
    trend,
  }
}

module.exports = {
  buildVehicleStats,
  recalculateVehicle,
  sortRecords,
}
