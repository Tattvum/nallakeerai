import {Injectable} from 'angular2/core';

import { Thing }   from './thing';
import { Harvest }   from './harvest';

import { FirebaseService }   from './firebase.service';
import { MockbaseService }   from './mockbase.service';


export const enum DOW { MON, TUE, WED, THU, FRI, SAT, SUN }
export const enum TimeMode { DAY, WEEK }

let HARVEST_LOG: Harvest[] = [];

let BUNDLES: { [index: string]: { [index: string]: number } } = {};

let FARM_TOTALS: { [index: string]: number } = {};
let PLANT_TOTALS: { [index: string]: number } = {};
let ALL_TOTAL: { quantity: number } = { quantity: 0 };

let FARMS: { code: string }[] = [];
let PLANTS: { code: string }[] = [];

function log(msg: any, obj: any = "") {
  //console.log(msg, obj);
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
    if(this.timeMode == TimeMode.DAY) return "D: "+strdate;
    else return "W: "+strdate;
  }

  private getDayString(): string {
    return DataService.dayString(this.date);
  }

  private goToLastMonday() {
    // let our week start on MON, usually SUN, 
    let dow = (this.date.getDay() -1 + 7) % 7;
    this.date.setDate(this.date.getDate() - dow);
  } 
  
  toggleDayWeek(): Promise<any> {
    if(this.timeMode == TimeMode.DAY) this.timeMode = TimeMode.WEEK;
    else this.timeMode = TimeMode.DAY;  
    this.goToLastMonday();//When you toggle you'll be on MON                       
    return this.setup();
  }
  
  now(): Promise<any> {
    this.date = new Date();
    if(this.timeMode == TimeMode.WEEK) this.goToLastMonday();
    return this.setup();
  }
  
  prev(): Promise<any> {
    let offset = -1;
    if(this.timeMode == TimeMode.WEEK) offset = -7;
    return this.move(offset);
  }
  
  next(): Promise<any> {
    let offset = 1;
    if(this.timeMode == TimeMode.WEEK) offset = 7;
    return this.move(offset);
  }

  private move(offset: number): Promise<any> {
    this.date.setDate(this.date.getDate() + offset);
    return this.setup();
  }

//--------------------------------------------------------------------------------------

  //IMPORTANT TBD 4/4 - - uncomment and use this in production deployment
  constructor(private service: FirebaseService) {
  //constructor(private service: MockbaseService) {
    this.now();
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
  
  private setupHarvestLogByTimeMode(): Promise<void> {
    let n = (this.getTimeMode() == TimeMode.DAY)? 1 : 7;
    HARVEST_LOG = [];//DELETE ALL AND FETCH ALL FRESH !! - for now
    let p = Promise.resolve();
    for (let i = 0; i < n; i++) {//NOTE: use let hear, not var!
      p = p.then(()=>{
        let dt = DataService.moveDate(this.date, i);
        let day = DataService.dayString(dt);
        //log(this.getDayString()+" "+i+" "+day);
        return this.setupHarvestLog(day);
      });
    }
    return p;
  }
  
  private setupHarvestLog(day: string): Promise<void> {
    return this.service.getHarvestLog(day).then(obj => {
      for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
          HARVEST_LOG.push(obj[p]);
        }
      }
      //log("sHL: "+day+" "+HARVEST_LOG.length);
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
    if(this.timeMode === TimeMode.WEEK) throw "Donot call this is in WEEK mode.";
    return this.addHarvestOnDay(this.getDayString(), f, p, q);
  }

  addHarvestInWeek(dow: DOW, f: string, p: string, q: number): Promise<any> {
    if(this.timeMode === TimeMode.DAY) throw "Donot call this is in DAY mode.";
    let d = new Date(this.date.getTime());
    let offset = (d.getDay() -1 + 7) % 7;
    d.setDate(d.getDate() + offset + dow);
    let day = DataService.dayString(d);
    log("addHarvestInWeek: "+day);
    return this.addHarvestOnDay(day, f, p, q);
  }

  addFarm(code: string): Promise<any> {
    if(this.timeMode === TimeMode.WEEK) throw "Donot call this is in WEEK mode.";
    let farm = { code: code };
    log("ADD FARM: " + code);
    FARMS.push(farm);
    this.computeGrid();
    return this.service.addFarm(farm);
  }

  addPlant(code: string): Promise<any> {
    if(this.timeMode === TimeMode.WEEK) throw "Donot call this is in WEEK mode.";
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
