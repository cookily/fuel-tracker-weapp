const { createId } = require('../../utils/format')
const { getCurrentVehicle, getVehicles, setCurrentVehicle, upsertVehicle } = require('../../utils/state')

Page({
  data: {
    vehicles: [],
    currentVehicleId: null,
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    const vehicles = getVehicles()
    const currentVehicle = getCurrentVehicle()

    this.setData({
      vehicles,
      currentVehicleId: currentVehicle ? currentVehicle.id : null,
    })
  },

  handleCreate() {
    wx.navigateTo({
      url: '/pages/record-form/index?mode=vehicle',
    })
  },

  handleQuickCreate() {
    const vehicle = upsertVehicle({
      id: createId('vehicle'),
      name: `车辆${this.data.vehicles.length + 1}`,
      plateNote: '',
      fuelType: '92#汽油',
      tankCapacity: null,
      records: [],
    })
    setCurrentVehicle(vehicle.id)
    this.loadData()
  },

  handleSelect(event) {
    const { id } = event.currentTarget.dataset
    setCurrentVehicle(id)
    this.loadData()
  },

  handleEdit(event) {
    const { id } = event.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/record-form/index?mode=vehicle&id=${id}`,
    })
  },
})
