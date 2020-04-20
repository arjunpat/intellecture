module.exports = {
  success(data = {}) {
    return {
      success: true,
      data
    }
  },
  error(error) {
    return {
      success: false,
      error
    }
  }
}
