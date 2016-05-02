import {Injector, provide} from 'angular2/core';
import {Http, BaseRequestOptions} from 'angular2/http';
import {MockBackend} from 'angular2/http/testing';

import {
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  it,
  inject,
  injectAsync
} from 'angular2/testing';

import { DataService } from './data.service';
import { MockbaseService } from './mockbase.service';

//-----------------------------------------------------------------------------

//setTimeout that returns a promise
function delay(ms): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  });
}

function checkGrid(s: DataService, f: string, p: string, 
    fpq: number, fq: number, pq: number, qq: number) {
  expect(s.getHarvest(f, p)).toEqual(fpq);
  expect(s.getFarmTotal(f)).toEqual(fq);
  expect(s.getPlantTotal(p)).toEqual(pq);
  expect(s.getGrandTotal()).toEqual(qq);
  console.log(f+' '+p+' '+fpq+' '+fq+' '+pq+' '+qq);
} 

//.-----p1-------p2----
//.f1---10-------40------(50)
//.f2---80-------20------(100)
//.----(90)-----(60)-----(150)
let f1 = "farm1", f2 = "farm2", p1 = "plant3", p2 = "plant5";

function rectCheckZero(s: DataService) {
  expect(s.getHarvest(f1, p1)).toEqual(0);
  expect(s.getHarvest(f1, p2)).toEqual(0);
  expect(s.getHarvest(f2, p1)).toEqual(0);
  expect(s.getHarvest(f2, p2)).toEqual(0);

  expect(s.getFarmTotal(f1)).toEqual(0);
  expect(s.getFarmTotal(f2)).toEqual(0);

  expect(s.getPlantTotal(p1)).toEqual(0);
  expect(s.getPlantTotal(p2)).toEqual(0);

  expect(s.getGrandTotal()).toEqual(0);
}

function rectCheck(s: DataService) {
  expect(s.getHarvest(f1, p1)).toEqual(10);
  expect(s.getHarvest(f1, p2)).toEqual(40);
  expect(s.getHarvest(f2, p1)).toEqual(80);
  expect(s.getHarvest(f2, p2)).toEqual(20);

  expect(s.getFarmTotal(f1)).toEqual(50);
  expect(s.getFarmTotal(f2)).toEqual(100);

  expect(s.getPlantTotal(p1)).toEqual(90);
  expect(s.getPlantTotal(p2)).toEqual(60);

  expect(s.getGrandTotal()).toEqual(150);
}

function rectAdd(s: DataService): Promise<any> {
  console.log('rectAdd');
  return s.addHarvest(f1, p1, 10).then(() => {
    checkGrid(s, f1, p1, 10, 10, 10, 10);
    return s.addHarvest(f1, p2, 40).then(() => {
      checkGrid(s, f1, p2, 40, 50, 40, 50);
      return s.addHarvest(f2, p1, 80).then(() => {
        checkGrid(s, f2, p1, 80, 80, 90, 130);
        return s.addHarvest(f2, p2, 20).then(() => {
          checkGrid(s, f2, p2, 20, 100, 60, 150);
        });
      });
    });
  });
} 

describe('DataService', () => {

  beforeEachProviders(() => [MockbaseService, DataService]);

  it('harvest grid computation is fine', inject([DataService], (service: DataService) => {
    //NOTE: by default it will be in DAY mode!
    //timeout is a hack to circumvent uncontrolled async calls in constructor 
    //surely we can discover a DRYer way to write this big chain
    return delay(100).then(() => {
      //For the mock service, surely 100 days in future will be empty
      return service.moveDay(100).then((arr) => {
        //so the harvest will be zero
        rectCheckZero(service);
        //now adding a new harvest,
        return rectAdd(service).then(() => {
          //and it shows up in the grid
          rectCheck(service);
          //the next day will also be zero
          return service.moveDay(1).then((arr) => {
            rectCheckZero(service);
            //but going back one day, we should see the new harvest
            return service.moveDay(-1).then((arr) => {
              rectCheck(service);
            });
          });
        });
      });
    });
  }));

});
