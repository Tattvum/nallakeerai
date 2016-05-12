import { Injectable } from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { Harvest }     from './harvest';

@Injectable()
export abstract class BaseService {

  abstract addFarm(farm: any): Promise<any>;
  abstract getFarms(): Promise<any>;

  abstract addPlant(plant: any): Promise<any>;
  abstract getPlants(): Promise<any>;

  abstract addHarvest(harvest: Harvest): Promise<any>;
  abstract getHarvestLog(day: string): Promise<any>;

  abstract authenticate(email: string, password: string): Promise<any>;

}
