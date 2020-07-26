
export function success(data = {}) {
  return {
    success: true,
    data
  }
}

export function received() {
  return {
    success: true,
    status: 'received'
  }
}

export function error(error?: any) {
  return {
    success: false,
    error
  }
}
