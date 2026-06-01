const { createId } = require('../../utils/format')
const { getState, upsertRecord, upsertVehicle } = require('../../utils/state')

const fuelTypes = ['92#汽油', '95#汽油', '98#汽油', '0#柴油', '其他']

function createVehicleForm(vehicle) {
  return {
    name: vehicle ? vehicle.name : '',
    plateNote: vehicle ? vehicle.plateNote : '',
    fuelTypeIndex: vehicle ? Math.max(0, fuelTypes.indexOf(vehicle.fuelType)) : 0,
    tankCapacity: vehicle && vehicle.tankCapacity !== null ? String(vehicle.tankCapacity) : '',
  }
}

function createRecordForm(record) {
  return {
    date: record ? record.date : '',
    odometerKm: record ? String(record.odometerKm) : '',
    fuelLiters: record ? String(record.fuelLiters) : '',
    totalCost: record ? String(record.totalCost) : '',
    isFullTank: record ? Boolean(record.isFullTank) : true,
  }
}

Page({
  data: {
    mode: 'record',
    vehicleId: '',
    recordId: '',
    vehicleForm: createVehicleForm(),
    recordForm: createRecordForm(),
    errors: {},
    fuelTypes,
  },

  onLoad(options) {
    const { mode = 'record', id = '', vehicleId = '' } = options
    const state = getState()
    const currentVehicle = state.vehicles.find((vehicle) => vehicle.id === (vehicleId || id)) || null
    const targetVehicle = mode === 'vehicle'
      ? state.vehicles.find((vehicle) => vehicle.id === id) || null
      : state.vehicles.find((vehicle) => vehicle.id === vehicleId) || null
    const targetRecord = targetVehicle && id && mode === 'record'
      ? targetVehicle.records.find((record) => record.id === id) || null
      : null

    this.setData({
      mode,
      vehicleId: targetVehicle ? targetVehicle.id : (currentVehicle ? currentVehicle.id : ''),
      recordId: targetRecord ? targetRecord.id : '',
      vehicleForm: createVehicleForm(targetVehicle),
      recordForm: createRecordForm(targetRecord),
    })

    wx.setNavigationBarTitle({
      title: mode === 'vehicle' ? '车辆信息' : '加油记录',
    })
  },

  handleVehicleInput(event) {
    const { field } = event.currentTarget.dataset
    this.setData({
      [`vehicleForm.${field}`]: event.detail.value,
      [`errors.${field}`]: '',
    })
  },

  handleFuelTypeChange(event) {
    this.setData({
      'vehicleForm.fuelTypeIndex': Number(event.detail.value),
    })
  },

  handleRecordInput(event) {
    const { field } = event.currentTarget.dataset
    this.setData({
      [`recordForm.${field}`]: event.detail.value,
      [`errors.${field}`]: '',
    })
  },

  handleDateChange(event) {
    this.setData({
      'recordForm.date': event.detail.value,
      'errors.date': '',
    })
  },

  handleSwitchChange(event) {
    this.setData({
      'recordForm.isFullTank': event.detail.value,
    })
  },

  validateVehicleForm() {
    const errors = {}
    const { name } = this.data.vehicleForm

    if (!name.trim()) {
      errors.name = '请输入车辆名称'
    }

    this.setData({ errors })
    return Object.keys(errors).length === 0
  },

  validateRecordForm() {
    const errors = {}
    const state = getState()
    const vehicle = state.vehicles.find((item) => item.id === this.data.vehicleId)
    const { date, odometerKm, fuelLiters, totalCost } = this.data.recordForm

    if (!date) {
      errors.date = '请选择加油日期'
    }
    if (!odometerKm) {
      errors.odometerKm = '请输入当前里程'
    }
    if (!fuelLiters) {
      errors.fuelLiters = '请输入加油量'
    }
    if (!totalCost) {
      errors.totalCost = '请输入加油金额'
    }

    const odometer = Number(odometerKm)
    const liters = Number(fuelLiters)
    const cost = Number(totalCost)

    if (odometerKm && (!Number.isFinite(odometer) || odometer <= 0)) {
      errors.odometerKm = '里程需为大于 0 的数字'
    }
    if (fuelLiters && (!Number.isFinite(liters) || liters <= 0)) {
      errors.fuelLiters = '加油量需为大于 0 的数字'
    }
    if (totalCost && (!Number.isFinite(cost) || cost <= 0)) {
      errors.totalCost = '金额需为大于 0 的数字'
    }

    if (vehicle && date && Number.isFinite(odometer)) {
      const compareCreatedAt = this.data.recordId
        ? ((vehicle.records.find((record) => record.id === this.data.recordId) || {}).createdAt || Date.now())
        : Date.now()

      const hypotheticalRecords = [...vehicle.records]
        .filter((record) => record.id !== this.data.recordId)
        .concat({
          id: this.data.recordId || 'draft-record',
          date,
          odometerKm: odometer,
          createdAt: compareCreatedAt,
        })
        .sort((left, right) => {
          if (left.date !== right.date) {
            return left.date > right.date ? 1 : -1
          }

          return (left.createdAt || 0) - (right.createdAt || 0)
        })

      const currentIndex = hypotheticalRecords.findIndex((record) => record.id === (this.data.recordId || 'draft-record'))
      const previousRecord = hypotheticalRecords[currentIndex - 1]
      const nextRecord = hypotheticalRecords[currentIndex + 1]

      if (previousRecord && odometer < Number(previousRecord.odometerKm)) {
        errors.odometerKm = '当前里程需大于或等于上一条记录'
      }

      if (nextRecord && odometer > Number(nextRecord.odometerKm)) {
        errors.odometerKm = '当前里程需小于或等于下一条记录'
      }
    }

    this.setData({ errors })
    return Object.keys(errors).length === 0
  },

  handleSave() {
    if (this.data.mode === 'vehicle') {
      this.saveVehicle()
      return
    }

    this.saveRecord()
  },

  saveVehicle() {
    if (!this.validateVehicleForm()) {
      return
    }

    const state = getState()
    const existingVehicle = state.vehicles.find((vehicle) => vehicle.id === this.data.vehicleId)
    const form = this.data.vehicleForm

    upsertVehicle({
      id: existingVehicle ? existingVehicle.id : createId('vehicle'),
      name: form.name.trim(),
      plateNote: form.plateNote.trim(),
      fuelType: fuelTypes[form.fuelTypeIndex],
      tankCapacity: form.tankCapacity ? Number(form.tankCapacity) : null,
      records: existingVehicle ? existingVehicle.records : [],
    })

    wx.navigateBack()
  },

  saveRecord() {
    if (!this.validateRecordForm()) {
      return
    }

    const state = getState()
    const vehicle = state.vehicles.find((item) => item.id === this.data.vehicleId)

    if (!vehicle) {
      wx.showToast({ title: '请先创建车辆', icon: 'none' })
      return
    }

    const existingRecord = vehicle.records.find((record) => record.id === this.data.recordId)
    const form = this.data.recordForm

    upsertRecord(vehicle.id, {
      id: existingRecord ? existingRecord.id : createId('record'),
      date: form.date,
      odometerKm: Number(form.odometerKm),
      fuelLiters: Number(form.fuelLiters),
      totalCost: Number(form.totalCost),
      isFullTank: form.isFullTank,
      createdAt: existingRecord ? existingRecord.createdAt : Date.now(),
    })

    wx.navigateBack()
  },
})
