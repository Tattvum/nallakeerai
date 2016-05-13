import { Injectable } from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { Harvest }     from './harvest';

function log(msg: any, obj: any = "") {
  console.log(msg, obj);
}

@Injectable()
export abstract class BaseService {

  constructor() {
    //log('BaseService constructor');
  }

  abstract addFarm(farm: any): Promise<any>;
  abstract getFarms(): Promise<any>;

  abstract addPlant(plant: any): Promise<any>;
  abstract getPlants(): Promise<any>;

  abstract addHarvest(harvest: Harvest): Promise<any>;
  abstract getHarvestLog(day: string): Promise<any>;

  protected auth: any = null;

  /*final*/ public isAuthenticated(): boolean {
    return this.auth != null;
  }
  
  protected abstract authenticateInternal(email: string, password: string): Promise<any>;

  /*final*/ public authenticate(email: string, password: string): Promise<any> {
    return this.authenticateInternal(email, password).then((_auth)=>{
      //log('BaseService authenticate called.');
      this.callAuthListeners();
      return Promise.resolve(this.auth);
    });
  }

  private fns: (()=>void)[] = [];
  
  //TBD: Allow remove listeners!!
  /*final*/ public addAuthListeners(fn: ()=>void) {
    if(this.isAuthenticated()) fn();
    this.fns.push(fn);
  }
  
  /*final*/ private callAuthListeners() {
    this.fns.forEach(fn => fn());  
  }
}
