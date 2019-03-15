exports.error = (message) => {
  return { error: {
    message
  }}
}

exports.success = (data) => {
  return {
    data: data
  }
}