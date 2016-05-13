import { Injectable } from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { Harvest }     from './harvest';

function log(msg: any, obj: any = "") {
  //console.log(msg, obj);
}

@Injectable()
export abstract class BaseService {

  abstract addFarm(farm: any): Promise<any>;
  abstract getFarms(): Promise<any>;

  abstract addPlant(plant: any): Promise<any>;
  abstract getPlants(): Promise<any>;

  abstract addHarvest(harvest: Harvest): Promise<any>;
  abstract getHarvestLog(day: string): Promise<any>;

  //TBD:
  /*final*/ private isAuthenticated(): boolean {
    return false;
  }
  
  protected abstract authenticateInternal(email: string, password: string): Promise<any>;

  /*final*/ public authenticate(email: string, password: string): Promise<any> {
    return this.authenticateInternal(email, password).then((auth)=>{
      log('BaseService authenticate called.');
      this.callAuthListeners();
      return Promise.resolve(auth);
    });
  }

  private fns: (()=>void)[] = [];
  //TBD: Allow remove listeners!!
  /*final*/ public addAuthListeners(fn: ()=>void) {
    this.fns.push(fn);
  }
  
  /*final*/ private callAuthListeners() {
    this.fns.forEach(fn => fn());  
  }
}
