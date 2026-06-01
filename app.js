const {
  loadAppState,
  saveAppState,
  createEmptyState,
  ensureStateShape,
} = require('./utils/store')

App({
  globalData: {
    state: createEmptyState(),
  },

  onLaunch() {
    this.globalData.state = ensureStateShape(loadAppState())
  },

  getState() {
    return ensureStateShape(this.globalData.state)
  },

  setState(nextState) {
    const safeState = ensureStateShape(nextState)
    this.globalData.state = safeState
    saveAppState(safeState)
    return safeState
  },
})
