import {Injectable} from 'angular2/core';
import {Observable}     from 'rxjs/Observable';

class Container {
  constructor(public arr: any[] = [], public obj: any = null){};
};

@Injectable()
export class MockbaseService {
  constructor() { }

  private f = new Container();
  private p = new Container();

  private rndKey(): string {
    return "<"+Math.random()+">";
  }
  
  private addThing(thing: any, things: Container): Promise<any> {
    things.arr.push(thing);
    if(things.obj == null) things.obj = {};
    things.obj[this.rndKey()] = thing;
    return Promise.resolve();
  }

  private getThings(prefix: string, nos: number[], things: Container): Promise<any> {
    if(things.obj != null) return Promise.resolve(things.obj); 
    nos.forEach(id => this.addThing({code: prefix + id}, things));
    return Promise.resolve(things.obj);
  }

  addFarm(farm: any): Promise<any> { return this.addThing(farm, this.f); }
  getFarms(): Promise<any> { return this.getThings("farm", [1,2], this.f); }

  addPlant(plant: any): Promise<any> { return this.addThing(plant, this.p); }
  getPlants(): Promise<any> { return this.getThings("plant", [1,2,3,5], this.p); }


  private harvestLog = null;
  
  addHarvest(harvest: any): Promise<any> {
    if(this.harvestLog == null) this.harvestLog = {};
    if(this.harvestLog[harvest.day] == null) this.harvestLog[harvest.day] = {};
    this.harvestLog[harvest.day][this.rndKey()] = harvest;
    return Promise.resolve();
  }

  getHarvestLog(day: string) {
    if(this.harvestLog != null) return Promise.resolve(); 
    let DAYS = ["2016-05-01", "2016-05-02", "2016-05-03"];
    DAYS.forEach(d => this.f.arr.forEach(f => this.p.arr.forEach(p => {
      this.harvestLog[d][f][p] = {day: d, farm: f.code, plant: p.code, quantity: (Math.random() * 50) - 5};
    })));
    return Promise.resolve(this.harvestLog);
  }


  private auth: any = {uid: "123", email: "test", token: "xyz"};
 
  authenticate(email: string, password: string): Promise<any> {
    if(email === "test")
      if(password == "test") return Promise.resolve(this.auth);
      else return Promise.reject("INVALID EMAIL!"); 
    else return Promise.reject("INVALID PASSWORD!"); 
  }

}
