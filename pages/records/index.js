const { formatDateLabel, formatNumber } = require('../../utils/format')
const { getCurrentVehicle, removeRecord } = require('../../utils/state')

Page({
  data: {
    vehicle: null,
    records: [],
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    const vehicle = getCurrentVehicle()
    const records = vehicle ? [...vehicle.records].reverse().map((record) => ({
      ...record,
      dateLabel: formatDateLabel(record.date),
      fuelPer100KmText: record.segment && !record.segment.pending
        ? `${formatNumber(record.segment.fuelPer100Km)} L/100km`
        : '待计算',
    })) : []

    this.setData({
      vehicle,
      records,
    })
  },

  handleCreate() {
    const vehicle = this.data.vehicle
    if (!vehicle) {
      wx.showToast({ title: '请先创建车辆', icon: 'none' })
      wx.switchTab({ url: '/pages/vehicles/index' })
      return
    }

    wx.navigateTo({
      url: `/pages/record-form/index?mode=record&vehicleId=${vehicle.id}`,
    })
  },

  handleEdit(event) {
    const { id } = event.currentTarget.dataset
    const vehicle = this.data.vehicle
    wx.navigateTo({
      url: `/pages/record-form/index?mode=record&vehicleId=${vehicle.id}&id=${id}`,
    })
  },

  handleDelete(event) {
    const { id } = event.currentTarget.dataset
    const vehicle = this.data.vehicle

    wx.showModal({
      title: '删除记录',
      content: '删除后会自动重算后续油耗数据。',
      success: ({ confirm }) => {
        if (!confirm) {
          return
        }

        removeRecord(vehicle.id, id)
        this.loadData()
      },
    })
  },
})
