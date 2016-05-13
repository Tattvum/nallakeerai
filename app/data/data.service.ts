import {Injectable} from '@angular/core';

import { Thing }   from './thing';
import { Harvest }   from './harvest';

import { BaseService }   from './base.service';


export const enum DOW { MON, TUE, WED, THU, FRI, SAT, SUN }
export const enum TimeMode { DAY, WEEK, MONTH }

let HARVEST_LOG: Harvest[] = [];

let BUNDLES: { [index: string]: { [index: string]: number } } = {};

let FARM_TOTALS: { [index: string]: number } = {};
let PLANT_TOTALS: { [index: string]: number } = {};
let ALL_TOTAL: { quantity: number } = { quantity: 0 };

let FARMS: { code: string }[] = [];
let PLANTS: { code: string }[] = [];

function log(msg: any, obj: any = "") {
  console.log(msg, obj);
}

const dows = ['sun','mon','tue','wed','thu','fri','sat'];
  
//--------------------------------------------------------------------------------------

@Injectable()
export class DataService {

  private date: Date = new Date();
  private timeMode: TimeMode = TimeMode.DAY;
  
  getTimeMode(): TimeMode {
    return this.timeMode;
  }
  
  private static moveDate(d: Date, offset: number): Date {
    let dd = new Date(d.getTime());
    dd.setDate(d.getDate() + offset);
    return dd;
  }
  
  private static dayString(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  showWhen(): string {
    let strdate = this.getDayString() +" ("+dows[this.date.getDay()]+")";
    switch (this.timeMode) {
      case TimeMode.DAY: return "D: "+strdate; 
      case TimeMode.WEEK: return "W: "+strdate; 
      case TimeMode.MONTH: return "M: "+strdate; 
      default:
        console.log('ERROR: unknown time mode: '+this.timeMode);
        return "ERROR";
    }
  }

  private getDayString(): string {
    return DataService.dayString(this.date);
  }

  private goToLastMonday() {
    // let our week start on MON, usually SUN, 
    let dow = (this.date.getDay() -1 + 7) % 7;
    this.date.setDate(this.date.getDate() - dow);
  } 
  
  private goToFirst() {
    this.date.setDate(1);
  } 
  
  setTimeMode(tm: TimeMode): Promise<any> {
    this.timeMode = tm;
    if(this.timeMode == TimeMode.WEEK) this.goToLastMonday();
    else if(this.timeMode == TimeMode.MONTH) this.goToFirst();
    return this.setup();
  }

  now(): Promise<any> {
    this.date = new Date();
    if(this.timeMode == TimeMode.WEEK) this.goToLastMonday();
    else if(this.timeMode == TimeMode.MONTH) this.goToFirst();
    return this.setup();
  }
  
  private moveDays(offset: number): Promise<any> {
    this.date.setDate(this.date.getDate() + offset);
    return this.setup();
  }

  private moveMonth(offset: number): Promise<any> {
    this.date.setMonth(this.date.getMonth() + offset);
    return this.setup();
  }

  prev(): Promise<any> {
    if(this.timeMode == TimeMode.DAY) return this.moveDays(-1);
    else if(this.timeMode == TimeMode.WEEK) return this.moveDays(-7);
    else if(this.timeMode == TimeMode.MONTH) return this.moveMonth(-1);
  }
  
  next(): Promise<any> {
    if(this.timeMode == TimeMode.DAY) return this.moveDays(1);
    else if(this.timeMode == TimeMode.WEEK) return this.moveDays(7);
    else if(this.timeMode == TimeMode.MONTH) return this.moveMonth(1);
  }

//--------------------------------------------------------------------------------------

  constructor(private service: BaseService) {
    log('DataService constructor called');
    service.addAuthListeners(()=> {
      log('authListener called!');
      this.now()
    });
  }
  
//--------------------------------------------------------------------------------------

  private setup(): Promise<any> {
    FARMS = [];
    PLANTS = [];
    return Promise.resolve().then(()=>{
      return this.service.getFarms();
    }).then((obj) => {
      for (var key in obj) FARMS.push(obj[key]);
      return this.service.getPlants();
    }).then((obj) => {
      for (var key in obj) PLANTS.push(obj[key]);
      return this.setupHarvestLogByTimeMode();
    }).then((obj) => {
      this.computeGrid();
      log('--setup:(' + HARVEST_LOG.length 
          +') '+ this.getDayString()+' ['+ALL_TOTAL.quantity+']'
          + ((this.timeMode==TimeMode.DAY)?"D":"W"));
      return Promise.resolve();
    });
  }
  
  private endDate(): Date {
    if(this.timeMode == TimeMode.DAY) 
        return DataService.moveDate(this.date, 0);
    else if(this.timeMode == TimeMode.WEEK) 
        return DataService.moveDate(this.date, 6);
    else {//assume month
      let dt = new Date(this.date.getTime());
      dt.setMonth(dt.getMonth() + 1);
      dt.setDate(dt.getDate() - 1);
      return dt;
    }
  }
  
  private setupHarvestLogByTimeMode(): Promise<void> {
    HARVEST_LOG = [];//DELETE ALL AND FETCH ALL FRESH !! - for now
    let startDay = DataService.dayString(this.date);
    let dt = this.endDate();
    let endDay = DataService.dayString(dt);
    return this.service.getHarvestLogs(startDay, endDay).then(obj => {
      if(obj != null) for (var p in obj) if (obj.hasOwnProperty(p))
          if(obj[p] != null) for (var pp in obj[p]) if (obj[p].hasOwnProperty(pp))
              HARVEST_LOG.push(obj[p][pp]);
      //log("sHLs: "+startDay+" "+endDay);
      //log(HARVEST_LOG);
      Promise.resolve();
    });
  }
  
  private computeGrid() {
    this.zeroGrid();

    let day = this.getDayString();
    HARVEST_LOG.forEach(h => {
      this.addQuantity(h.farm, h.plant, h.quantity);
    });
    
    log("FARMS: "+FARMS.length + ", PLANTS: " + PLANTS.length);
  }

  private zeroGrid() {
    this.ensureNonNullGrid();

    ALL_TOTAL.quantity = 0;
    FARMS.forEach((f) => FARM_TOTALS[f.code] = 0);
    PLANTS.forEach((p) => PLANT_TOTALS[p.code] = 0);
    FARMS.forEach((f) => PLANTS.forEach((p) => BUNDLES[f.code][p.code] = 0));
    //log("zeroGrid done...");
  }

  private ensureNonNullGrid() {
    if (ALL_TOTAL == null) ALL_TOTAL = { quantity: 0 };
    FARMS.forEach((f) => {
      if (FARM_TOTALS[f.code] == null) FARM_TOTALS[f.code] = 0;
    });
    PLANTS.forEach((p) => {
      if (PLANT_TOTALS[p.code] == null) PLANT_TOTALS[p.code] = 0;
    });
    FARMS.forEach((f) => {
      PLANTS.forEach((p) => {
        if (BUNDLES[f.code] == null) BUNDLES[f.code] = {};
        if (BUNDLES[f.code][p.code] == null) BUNDLES[f.code][p.code] = 0;
      });
    });
    //log("ensureNonNullGrid done...");
  }

  private addQuantity(f: string, p: string, q: number) {
    PLANT_TOTALS[p] += q;
    FARM_TOTALS[f] += q;
    ALL_TOTAL.quantity += q;
    BUNDLES[f][p] += q;
  }

  //--------------------------------------------------------------------------------------

  private addHarvestOnDay(d: string, f: string, p: string, q: number): Promise<any> {
    let harvest = { day: d, farm: f, plant: p, quantity: q };
    HARVEST_LOG.push(harvest);
    //assume the grid is for same
    this.addQuantity(f, p, q);
    return this.service.addHarvest(harvest);
  }
  
  //harvest this day as in grid
  addHarvest(f: string, p: string, q: number): Promise<any> {
    if(this.timeMode !== TimeMode.DAY) throw "Call this in DAY mode only.";
    return this.addHarvestOnDay(this.getDayString(), f, p, q);
  }

  addHarvestInWeek(dow: DOW, f: string, p: string, q: number): Promise<any> {
    if(this.timeMode !== TimeMode.WEEK) throw "Call this in WEEK mode only.";
    let d = new Date(this.date.getTime());
    let offset = (d.getDay() -1 + 7) % 7;
    d.setDate(d.getDate() + offset + dow);
    let day = DataService.dayString(d);
    log("addHarvestInWeek: "+day);
    return this.addHarvestOnDay(day, f, p, q);
  }

  addFarm(code: string): Promise<any> {
    if(this.timeMode !== TimeMode.DAY) throw "Call this in DAY mode only.";
    let farm = { code: code };
    log("ADD FARM: " + code);
    FARMS.push(farm);
    this.computeGrid();
    return this.service.addFarm(farm);
  }

  addPlant(code: string): Promise<any> {
    if(this.timeMode !== TimeMode.DAY) throw "Call this in DAY mode only.";
    let plant = { code: code };
    log("ADD PLANT: " + code);
    PLANTS.push(plant);
    this.computeGrid();
    return this.service.addPlant(plant);
  }

  //--------------------------------------------------------------------------------------
  //TBD: assume the inputs are valid, for now!

  getHarvest(farm: string, plant: string): number { return BUNDLES[farm][plant]; }
  getFarmTotal(farm: string): number { return FARM_TOTALS[farm]; }
  getPlantTotal(plant: string): number { return PLANT_TOTALS[plant]; }
  getGrandTotal(): number { return ALL_TOTAL.quantity; }

  //--------------------------------------------------------------------------------------

  getAll() {
    log('getAll called.');
    return Promise.resolve({
      farms: FARMS,
      plants: PLANTS,
      bundles: BUNDLES,
      farmTotals: FARM_TOTALS,
      plantTotals: PLANT_TOTALS,
      allTotal: ALL_TOTAL,
    });
  }

  //--------------------------------------------------------------------------------------

}
