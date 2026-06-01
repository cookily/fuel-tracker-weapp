const { formatNumber } = require('../../utils/format')
const { getCurrentVehicle, getVehicleStats } = require('../../utils/state')

Page({
  data: {
    vehicle: null,
    stats: null,
    trendBars: [],
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    const vehicle = getCurrentVehicle()
    const stats = vehicle ? getVehicleStats(vehicle.id) : null
    const maxTrend = stats && stats.trend.length
      ? Math.max(...stats.trend.map((item) => item.value), 1)
      : 1
    const trendBars = stats ? stats.trend.map((item) => ({
      ...item,
      height: `${Math.max(20, Math.round((item.value / maxTrend) * 180))}rpx`,
      valueText: formatNumber(item.value),
    })) : []

    this.setData({
      vehicle,
      stats,
      trendBars,
    })
  },
})
