function add (a, b) {
  return a + b
}

// the test
describe('Sample test', () => {
  it('should add numbers', () => {
    expect(add(2, 4)).toBe(6)
    expect(add(2, 4)).not.toBe(2)
  })
})