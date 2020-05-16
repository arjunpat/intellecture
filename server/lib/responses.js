module.exports = {
  success(data = {}) {
    return {
      success: true,
      data
    }
  },
  received() {
    return {
      success: true,
      status: 'received'
    }
  },
  error(error) {
    return {
      success: false,
      error
    }
  }
}
