import {
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  it,
  inject,
  injectAsync
} from '@angular/core/testing';

import { MockbaseService } from './mockbase.service';

//-----------------------------------------------------------------------------

function log(msg: any, obj: any = "") {
  //console.log(msg, obj);
}

type TwoArrays = {keys: string[], vals: any[]}; 

function o2a(obj: any): TwoArrays {
  let out = {keys: [], vals: []};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      out.keys.push(key);
      out.vals.push(obj[key]);
    }
  }
  return out;
}

function o2ap(result: Promise<any>): Promise<any[]> {
  return result.then((obj) => {
    return Promise.resolve(o2a(obj).vals);
  });
}

function o2ap2(result: Promise<any>): Promise<TwoArrays> {
  return result.then((obj) => {
    return Promise.resolve(o2a(obj));
  });
}

function checkIsQuantity(q: number) {
  expect(q).toBe(Math.floor(q));//should be an integer
  expect(q).toBeLessThan(50);
}

function checkObj(obj: any, len: number, n: number) {
  let arr = o2a(obj).vals;
  expect(arr.length).toEqual(len);
  checkIsQuantity(arr[n].quantity);//assuming it is an obj
}

//---------------------------------------------------------

describe('Mockbase', () => {

  beforeEachProviders(() => [MockbaseService]);

  it('default farms list has 2 items', inject([MockbaseService], (service: MockbaseService) => {
    return o2ap(service.getFarms()).then((arr) => {
      expect(arr[1].code).toEqual("farm2");
      expect(arr.length).toEqual(2);
    });
  }));

  it('add farm works', inject([MockbaseService], (service: MockbaseService) => {
    return service.addFarm({ code: "test9", some: 13 }).then(() => {
      return o2ap(service.getFarms()).then((arr) => {
        expect(arr.length).toEqual(3);
        expect(arr[2].code).toEqual("test9");
      });
    });
  }));

  it('default plant list has 4 items', inject([MockbaseService], (service: MockbaseService) => {
    return o2ap(service.getPlants()).then((arr) => {
      expect(arr[3].code).toEqual("plant5");
      expect(arr.length).toEqual(4);
    });
  }));

  it('add plant works', inject([MockbaseService], (service: MockbaseService) => {
    return service.addPlant({ code: "test9", some: 13 }).then(() => {
      return o2ap(service.getPlants()).then((arr) => {
        expect(arr.length).toEqual(5);
        expect(arr[4].code).toEqual("test9");
      });
    });
  }));

  //3 days x 4 plants x 2 farms = 24 entries
  it('default harvest log has 24 entries', inject([MockbaseService], (service: MockbaseService) => {
    return o2ap(service.getHarvestLog("2016-05-01")).then((arr) => {
      expect(arr.length).toEqual(8);
      expect(arr[5].day).toEqual("2016-05-01");
      expect(arr[5].farm).toEqual("farm2");
      expect(arr[5].plant).toEqual("plant2");
      checkIsQuantity(arr[5].quantity);
    });
  }));

  it('default log for unknown day is empty', inject([MockbaseService], (service: MockbaseService) => {
    return o2ap(service.getHarvestLog("2016-06-01")).then((arr) => {
      expect(arr.length).toEqual(0);
    });
  }));

  it('add harvest works for known day', inject([MockbaseService], (service: MockbaseService) => {
    let d = "2016-05-01";
    let harvest = { day: d, farm: "farm1", plant: "plant1", quantity: 13 };
    return service.addHarvest(harvest).then(() => {
      return o2ap(service.getHarvestLog(d)).then((arr) => {
        expect(arr.length).toEqual(9);
        expect(arr[8]).toEqual(harvest);
      });
    });
  }));

  it('add harvest works for unknown day', inject([MockbaseService], (service: MockbaseService) => {
    let d = "2016-06-01";
    let harvest = { day: d, farm: "farm1", plant: "plant1", quantity: 13 };
    return service.addHarvest(harvest).then(() => {
      return o2ap(service.getHarvestLog(d)).then((arr) => {
        expect(arr.length).toEqual(1);
        expect(arr[0]).toEqual(harvest);
      });
    });
  }));

  it('autheticate test/test only', inject([MockbaseService], (service: MockbaseService) => {
    return Promise.all([
      service.authenticate("test", "test").then((auth) => {
        expect(auth).toEqual({ uid: "123", email: "test", token: "xyz" });
      }),
      service.authenticate("x", "test").catch((reason) => {
        expect(reason).toContain("INVALID EMAIL");
      }),
      service.authenticate("test", "x").catch((reason) => {
        expect(reason).toContain("INVALID PASSWORD");
      }),
    ]);
  }));

  it('harvest logs for known range', inject([MockbaseService], (service: MockbaseService) => {
    return o2ap2(service.getHarvestLogs("2016-04-30", "2016-05-07")).then((days) => {
      expect(days.keys.length).toEqual(3);
      
      expect(days.keys[0]).toEqual("2016-05-01");
      checkObj(days.vals[0], 8, 6)
      expect(days.keys[1]).toEqual("2016-05-02");
      checkObj(days.vals[1], 8, 2)
      expect(days.keys[2]).toEqual("2016-05-03");
      checkObj(days.vals[2], 8, 5)
      expect(days.keys[4]).toEqual(undefined);
    });
  }));

});