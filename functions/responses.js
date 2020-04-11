module.exports = {
  success(data = undefined) {
    return {
      success: true,
      data
    }
  },
  error(error = undefined) {
    return {
      success: false,
      error
    }
  }
}