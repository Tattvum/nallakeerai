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
        }
      }
      return Promise.resolve(fa);
    });
 
}
  
describe('Mockbase', () => {
  
  let service: MockbaseService;
  
  beforeEachProviders( () => [ MockbaseService ] );
  
  it('default farms list has 2 items', inject([MockbaseService], (service: MockbaseService) => {
    return objToArray(service.getFarms()).then((arr) => {
      expect(arr[1].code).toEqual("farm2");
      expect(arr.length).toEqual(2);
    });
  }));
  
  it('add farm works', inject([MockbaseService], (service: MockbaseService) => {
    return service.addFarm({code: "test9", some: 13}).then(() => {
      return objToArray(service.getFarms()).then((arr) => {
        expect(arr.length).toEqual(3);
        expect(arr[2].code).toEqual("test9");
      });
    });
  }));
  
  it('default plant list has 4 items', inject([MockbaseService], (service: MockbaseService) => {
    return objToArray(service.getPlants()).then((arr) => {
      expect(arr[3].code).toEqual("plant5");
      expect(arr.length).toEqual(4);
    });
  }));
  
  it('add plant works', inject([MockbaseService], (service: MockbaseService) => {
    return service.addPlant({code: "test9", some: 13}).then(() => {
      return objToArray(service.getPlants()).then((arr) => {
        expect(arr.length).toEqual(5);
        expect(arr[4].code).toEqual("test9");
      });
    });
  }));
  
  //3 days x 4 plants x 2 farms = 24 entries
  it('default harvest log has 24 entries', inject([MockbaseService], (service: MockbaseService) => {
    return objToArray(service.getHarvestLog("2016-05-01")).then((arr) => {
      expect(arr.length).toEqual(8);
      expect(arr[5].day).toEqual("2016-05-01");
      expect(arr[5].farm).toEqual("farm2");
      expect(arr[5].plant).toEqual("plant2");
      expect(arr[5].quantity).toBe(Math.floor(arr[5].quantity));//should be an integer
      expect(arr[5].quantity).toBeLessThan(50);
    });
  }));

  it('default log for unknown day is empty', inject([MockbaseService], (service: MockbaseService) => {
    return objToArray(service.getHarvestLog("2016-06-01")).then((arr) => {
      expect(arr.length).toEqual(0);
    });
  }));

  it('add harvest works for known day', inject([MockbaseService], (service: MockbaseService) => {
    let d = "2016-05-01"; 
    let harvest = {day: d, farm: "farm1", plant: "plant1", quantity: 13}; 
    return service.addHarvest(harvest).then(() => {
      return objToArray(service.getHarvestLog(d)).then((arr) => {
        expect(arr.length).toEqual(9);
        expect(arr[8]).toEqual(harvest);
      });
    });
  }));
  
  it('add harvest works for unknown day', inject([MockbaseService], (service: MockbaseService) => {
    let d = "2016-06-01"; 
    let harvest = {day: d, farm: "farm1", plant: "plant1", quantity: 13}; 
    return service.addHarvest(harvest).then(() => {
      return objToArray(service.getHarvestLog(d)).then((arr) => {
        expect(arr.length).toEqual(1);
        expect(arr[0]).toEqual(harvest);
      });
    });
  }));
  
  it('autheticate test:test only', inject([MockbaseService], (service: MockbaseService) => {
    return Promise.all([
      service.authenticate("test", "test").then((auth) => {
        expect(auth).toEqual({uid: "123", email: "test", token: "xyz"});
      }),
      service.authenticate("x", "test").catch((reason) => {
        expect(reason).toContain("INVALID EMAIL");
      }),
      service.authenticate("test", "x").catch((reason) => {
        expect(reason).toContain("INVALID PASSWORD");
      }),
    ]);
  }));
 
});