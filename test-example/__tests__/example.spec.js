require('../example')

const example = window.example
let name

beforeAll(() => {
  name = 'Mark'
  console.log('I run before all tests')
})

afterAll(() => {
  console.log('I run after all tests have completed')
})

beforeEach(() => {
  console.log('I run before each test')
})

afterEach(() => {
  console.log('I run after each test')
})

describe('example', () => {

  xtest(`Skipped test`, () => {
    expect(example.hello(name)).toEqual(`Hello ${name}`)
  })

  test.only('Only test', () => {
    expect(example.hello()).toEqual('Hello undefined')
  })
})