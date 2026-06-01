function formatNumber(value, digits = 2) {
  const number = Number(value)
  if (!Number.isFinite(number)) {
    return '--'
  }

  return number.toFixed(digits)
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
}

function formatDateLabel(value) {
  return value || '--'
}

module.exports = {
  createId,
  formatDateLabel,
  formatNumber,
}
