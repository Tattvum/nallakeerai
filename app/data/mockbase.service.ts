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

  getHarvestLog(day: string) { return Promise.resolve(this.harvestLog[day]); }

//-----------------------------------------------------------------------------

  private auth: any = {uid: "123", email: "test", token: "xyz"};
 
  private authenticateDummy(): Promise<any> {
    return this.authenticateInternal('test', 'test');
  }
  
  protected authenticateInternal(email: string, password: string): Promise<any> {
    if(email === "test")
      if(password == "test") return Promise.resolve(this.auth);
      else return Promise.reject("INVALID PASSWORD!"); 
    else return Promise.reject("INVALID EMAIL!"); 
  }

}
