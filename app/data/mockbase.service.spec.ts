import {
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  it,
  inject,
  injectAsync
} from 'angular2/testing';

import { MockbaseService } from './mockbase.service';

//-----------------------------------------------------------------------------

function objToArray(result: Promise<any>): Promise<any[]> {
    return result.then((obj) => {
      let fa = [];
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          fa.push(obj[key]);
          console.log(obj[key]);
        }
      }
      return Promise.resolve(fa);
    });
 
}
  
describe('in mockbase', () => {
  
  let service: MockbaseService;
  
  beforeEachProviders( () => [ MockbaseService ] );
  
  it('mock farms list has 2 items', inject([MockbaseService], (service: MockbaseService) => {
    return objToArray(service.getFarms()).then((arr) => {
      expect(arr[1].code).toEqual("farm2");
      expect(arr.length).toEqual(2);
    });
  }));
  
  it('mock plant list has 4 items', inject([MockbaseService], (service: MockbaseService) => {
    return objToArray(service.getPlants()).then((arr) => {
      expect(arr[3].code).toEqual("plant5");
      expect(arr.length).toEqual(4);
    });
  }));
  
});