const axios = require('axios')

const doGet = url => axios.get(url).then(result => result.data)

module.exports = {
  doGet
}
