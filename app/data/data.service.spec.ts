import {Injector, provide} from '@angular/core';
import {Http, BaseRequestOptions} from '@angular/http';
import {MockBackend} from '@angular/http/testing';

import {
  beforeEach,
  beforeEachProviders,
  describe, xdescribe,
  expect,
  it, xit,
  inject,
  injectAsync
} from '@angular/core/testing';

import { DataService, TimeMode, DOW } from './data.service';
import { MockbaseService } from './mockbase.service';

//-----------------------------------------------------------------------------

function log(msg: any, obj: any = "") {
  //console.log(msg, obj);
}

//setTimeout that returns a promise
function delay(ms: number): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  });
}

function gap(): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve());
  });
}

function checkGrid(s: DataService, f: string, p: string, 
    fpq: number, fq: number, pq: number, qq: number) {
  expect(s.getHarvest(f, p)).toEqual(fpq);
  expect(s.getFarmTotal(f)).toEqual(fq);
  expect(s.getPlantTotal(p)).toEqual(pq);
  expect(s.getGrandTotal()).toEqual(qq);
  //log(f+' '+p+' '+fpq+' '+fq+' '+pq+' '+qq);
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

function rectCheckFull(s: DataService,
    f1p1: number, f1p2: number, f2p1: number, f2p2: number,
    f1t: number, f2t: number, p1t: number, p2t: number,
    gt: number) {
  expect(s.getHarvest(f1, p1)).toEqual(f1p1);
  expect(s.getHarvest(f1, p2)).toEqual(f1p2);
  expect(s.getHarvest(f2, p1)).toEqual(f2p1);
  expect(s.getHarvest(f2, p2)).toEqual(f2p2);

  expect(s.getFarmTotal(f1)).toEqual(f1t);
  expect(s.getFarmTotal(f2)).toEqual(f2t);

  expect(s.getPlantTotal(p1)).toEqual(p1t);
  expect(s.getPlantTotal(p2)).toEqual(p2t);

  expect(s.getGrandTotal()).toEqual(gt);
  log('rectCheckFull');
}

function rectCheck(s: DataService) {
  log('rectCheck');
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
  return Promise.resolve().then(() => {
    log('rectAdd');
    return s.addHarvest(f1, p1, 10);
  }).then(()=>{
    checkGrid(s, f1, p1, 10, 10, 10, 10);
    return s.addHarvest(f1, p2, 40);
  }).then(()=>{
    checkGrid(s, f1, p2, 40, 50, 40, 50);
    return s.addHarvest(f2, p1, 80);
  }).then(()=>{
    checkGrid(s, f2, p1, 80, 80, 90, 130);
    return s.addHarvest(f2, p2, 20);
  }).then(()=>{
    checkGrid(s, f2, p2, 20, 100, 60, 150);
  });
} 

describe('DataService', () => {

  beforeEachProviders(() => [MockbaseService, DataService]);

  it('harvest DAY grid computation is fine', inject([DataService], (s: DataService) => {
    //NOTE: by default it will be in DAY mode!
    expect(s.getTimeMode()).toEqual(TimeMode.DAY);
    //timeout is a hack to circumvent uncontrolled async calls in service constructor 
    return gap().then(()=>{
    }).then(()=>{
      //For the mock service, surely 1 day after 2016-05-03 will be empty
      return s.next();
    }).then(()=>{
      //so the harvest will be zero
      rectCheckZero(s);
      //now adding a new harvest,
      return rectAdd(s);
    }).then(()=>{
      //and it shows up in the grid
      rectCheck(s);
      //the next day...
      return s.next();
    }).then(()=>{
      //... will also be zero
      rectCheckZero(s);
      //but going back one day... 
      return s.prev();
    }).then(()=>{
      //...we should see the new harvest
      rectCheck(s);
    });
  }));

  //.------p1(d)----p2(d)----
  //.f1---10(1)----40(2)---(50)
  //.f2---80(1)----20(2)---(100)
  //.-----(90)-----(60)----(150)
  let d1 = DOW.MON, d2 = DOW.THU;

  function rectWeekAdd(s: DataService): Promise<any> {
    return Promise.resolve().then(() => {
      log('recWeektAdd');
      return s.addHarvestInWeek(d1, f1, p1, 10);
    }).then(()=>{
      checkGrid(s, f1, p1, 10, 10, 10, 10);
      return s.addHarvestInWeek(d2, f1, p2, 40);
    }).then(()=>{
      checkGrid(s, f1, p2, 40, 50, 40, 50);
      return s.addHarvestInWeek(d1, f2, p1, 80);
    }).then(()=>{
      checkGrid(s, f2, p1, 80, 80, 90, 130);
      return s.addHarvestInWeek(d2, f2, p2, 20);
    }).then(()=>{
      checkGrid(s, f2, p2, 20, 100, 60, 150);
    });
  } 
  
  it('harvest WEEK grid computation is fine', inject([DataService], (s: DataService, done) => {
    //the timeout hack
    return gap().then(()=>{
    }).then(()=>{
      log("< toggleDayWeek >");
      //go to the WEEK mode from the default DAY mode
      return s.toggleDayWeek();
    }).then(()=>{
      log("< next >");
      //move 1 week in future
      return s.next();
    }).then(()=>{
      log("< rectWeekAdd >");
      //all should be zero (atleast in mock and staging test)
      rectCheckZero(s);
      //add few harvests in some days WITHIN the week
      return rectWeekAdd(s);
    }).then(()=>{
      log("total: "+s.getGrandTotal());
      log("< next >");
      //ensure fully that it is added
      rectCheck(s);      
      //move again one week forward
      return s.next();
    }).then(()=>{
      log("< prev >");
      //again all should be empty
      rectCheckZero(s);
      //move back one week
      return s.prev();
    }).then(()=>{
      log("total: "+s.getGrandTotal());
      //it should show the new added harvests
      //rectCheck(s);
    });
  }));

  it('harvest in WEEK == harvest on some day', inject([DataService], (s: DataService) => {
    //the timeout hack 
    return gap().then(() => {
      //go to the WEEK mode from the default DAY mode
      return s.toggleDayWeek();
    }).then(()=>{
      //move 10 weeks in future
      return s.next();
    }).then(()=>{
      //all should be zero (atleast in mock and the staging test)
      rectCheckZero(s);
      //add few harvests in some days WITHIN the week
      return rectWeekAdd(s);
    }).then(()=>{
      //ensure fully that it is added
      log('[ before day ] '+s.showWhen());
      rectCheck(s);      
      //go to the DAY mode from WEEK
      return s.toggleDayWeek();
    }).then(()=>{
      //we should be in MON so check d1 harvest is all fine
      rectCheckFull(s, 10, 0, 80, 0, 10, 80, 90, 0, 90);
      //now move 3 days to THU
      return s.next();
    }).then(()=>{
      return s.next();
    }).then(()=>{
      return s.next();
    }).then(()=>{
      //we should be in THU so check d2 harvest is all fine
      rectCheckFull(s, 0, 40, 0, 20, 40, 20, 0, 60, 60);
    }).then(()=>{
      //go to the WEEK mode from DAY
      return s.toggleDayWeek();
    }).then(()=>{
      //ensure fully that it is all same
      rectCheck(s);      
    });
  }));

});
