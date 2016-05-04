function add (a, b) {
  return a + b
}

//setTimeout that returns a promise
function delay(ms): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  });
}

// the tests
describe('Sample test', () => {

  it('should add numbers', () => {
    expect(add(2, 4)).toBe(6)
    expect(add(2, 4)).not.toBe(2)
  })

/*
  xit('normal promise chain works', done => {
    return delay(1000).then(() => {
      console.log('1st delay done');
      expect(true).toBe(true);
      return delay(2000).then(() => {
        expect(true).toBe(true)
        console.log('2nd delay done');
        done();
      })
    })
  })

  function doSomething(msg: string) {
    console.log(msg);
    expect(true).toBe(true);
  }

  xit('promise sequence works', done => {
    return Promise.resolve().then(()=>{
      return delay(1000);
    }).then(()=>{
      doSomething('first'); 
      return delay(2000);
    }).then(()=>{
      doSomething('second');
      done(); 
    });
  })
*/

})

