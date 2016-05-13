import { Injectable, Inject } from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { Harvest }     from './harvest';
import { BaseService }     from './base.service';
import { NO_LOGIN }     from '../common';

class Container {
  constructor(public arr: any[] = [], public obj: any = {}){};
}

function log(msg: any, obj: any = "") {
  //console.log(msg, obj);
}

//setTimeout that returns a promise
function delay(ms: number): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  });
}

//NOTE: This is for dev testing purpose only.
@Injectable()
export class MockbaseService extends BaseService {
  private f = new Container();
  private p = new Container();

  private harvestLog = {};
  
  private rndKey(): string {
    return "<"+Math.random()+">";
  }
  
  constructor() {
    super();
    //log('MockbaseService called');
    [1,2].forEach(id => this.addThing({code: "farm" + id}, this.f));
    [1,2,3,5].forEach(id => this.addThing({code: "plant" + id}, this.p));
    let DAYS = ["2016-05-01", "2016-05-02", "2016-05-03"];
    DAYS.forEach(d => {
      this.harvestLog[d] = {};
      this.f.arr.forEach(f => this.p.arr.forEach(p => {
        let q = Math.floor((Math.random() * 50) - 5);
        this.harvestLog[d][this.rndKey()] = {day: d, farm: f.code, plant: p.code, quantity: q};
      }));
    });
   }

  private addThing(thing: any, things: Container): Promise<any> {
    things.arr.push(thing);
    things.obj[this.rndKey()] = thing;
    return Promise.resolve();
  }

//-----------------------------------------------------------------------------

  addFarm(farm: any): Promise<any> { return this.addThing(farm, this.f); }
  getFarms(): Promise<any> { return Promise.resolve(this.f.obj); }

  addPlant(plant: any): Promise<any> { return this.addThing(plant, this.p); }
  getPlants(): Promise<any> { return Promise.resolve(this.p.obj); }

//-----------------------------------------------------------------------------

  addHarvest(harvest: Harvest): Promise<any> {
    if(this.harvestLog[harvest.day] == null) this.harvestLog[harvest.day] = {};
    this.harvestLog[harvest.day][this.rndKey()] = harvest;
    return Promise.resolve();
  }

  getHarvestLog(day: string): Promise<any> { 
    return Promise.resolve(this.harvestLog[day]); 
  }

  //NOTE: day should be in ISO CCYY-MM-DD format and trimmed
  getHarvestLogs(startDay: string, endDay: string): Promise<any> {
    if(endDay < startDay) return Promise.reject("ERROR: "+startDay +" !< "+ endDay);
    //NOTE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse#Browser_compatibility
    let dt = new Date(startDay);
    let out = {};
    let s = dt.toISOString().slice(0, 10);
    do {
      let obj = this.harvestLog[s];    
      if(obj != null) out[s] = obj;
      dt.setDate(dt.getDate()+1);
      s = dt.toISOString().slice(0, 10);
    } while (s <= endDay);
    log(out);
    //return delay(400).then(()=>{
      return Promise.resolve(out);
    //}); 
  }

//-----------------------------------------------------------------------------

  protected auth: any = {uid: "123", email: "test", token: "xyz"};
 
  private authenticateDummy(): Promise<any> {
    return this.authenticateInternal('test', 'test');
  }
  
  protected authenticateInternal(email: string, password: string): Promise<any> {
    if(email === "test")
      if(password == "test") {
        return Promise.resolve(this.auth);
      } else return Promise.reject("INVALID PASSWORD!"); 
    else return Promise.reject("INVALID EMAIL!"); 
  }

}
