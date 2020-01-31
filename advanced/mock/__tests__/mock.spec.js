const axios = require('axios')
const { doGet } = require('..')

jest.mock('axios')

describe('doGet', () => {
  test('should return json object', async () => {
    const data = {
      name: 'Bob'
    }

    axios.get.mockImplementationOnce(async () => ({ data }))
    expect(await doGet('http://localhost/somedata.json')).toEqual(data)
  })
})
