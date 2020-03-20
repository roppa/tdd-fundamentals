function splitString(string) {
  return string.match(/[^ ]+/g)
}

module.exports = function dictionary(words) {
  return (splitString(words) || []).reduce((curr, next) => {
    curr[next] = curr[next] + 1 || 1
    return curr
  }, {})
}
