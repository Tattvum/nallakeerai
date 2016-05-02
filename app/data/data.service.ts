import {Injectable} from 'angular2/core';

import { Thing }   from './thing';
import { Harvest }   from './harvest';

import { FirebaseService }   from './firebase.service';
import { MockbaseService }   from './mockbase.service';


@Injectable()
export class DataService {

  //--------------------------------------------------------------------------------------

  private setupHarvestLog(day: string): Promise<void> {
    HARVEST_LOG = [];//DELETE ALL AND FETCH ALL FRESH !! - for now
    return this.service.getHarvestLog(day).then(obj => {
      for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
          HARVEST_LOG.push(obj[p]);
        }
      }
      console.log("fetch complete..." + HARVEST_LOG.length);
    });
  }

// IMPORTANT TBD 4/4 - - uncomment and use this in production deployment
//  constructor(private service: FirebaseService) {
  constructor(private service: MockbaseService) {
    this.setDate(new Date());
    let self = this;

    FARMS = [];
    PLANTS = [];

    this.service.getFarms().then(obj => {
        for (var key in obj) FARMS.push(obj[key]);
    }).then(() => {
      this.service.getPlants().then(obj => {
          for (var key in obj) PLANTS.push(obj[key]);
      }).then(() => {
        this.setupHarvestLog(day).then(() => {
          this.computeGrid();
          console.log("setup done.");
        });
      });
    });

  }

  //--------------------------------------------------------------------------------------

  private ensureNonNullGrid() {
    if (ALL_TOTAL == null) ALL_TOTAL = {quantity: 0};
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
    //console.log("ensureNonNullGrid done...");
  }

  private zeroGrid() {
    this.ensureNonNullGrid();

    ALL_TOTAL.quantity = 0;
    FARMS.forEach( (f) => FARM_TOTALS[f.code] = 0 );
    PLANTS.forEach( (p) => PLANT_TOTALS[p.code] = 0 );
    FARMS.forEach( (f) => PLANTS.forEach( (p) => BUNDLES[f.code][p.code] = 0 ));
    //console.log("zeroGrid done...");
  }

  private computeGrid() {
    this.zeroGrid();

    HARVEST_LOG.forEach(h => {
      if (h.day !== day) return;
      this.addQuantity(h.farm, h.plant, h.quantity);
    });

    //console.log(BUNDLES);
    console.log("computation complete...");
  }

  private addQuantity(f: string, p: string, q: number) {
    PLANT_TOTALS[p] += q;
    FARM_TOTALS[f] += q;
    ALL_TOTAL.quantity += q;
    BUNDLES[f][p] += q;
  }

  //--------------------------------------------------------------------------------------

  private setDate(d: Date) {
    date = d;
    day = this.getDayString();
    console.log("SET: " + day);
  }

  getDayString(): string {
    return date.toISOString().slice(0, 10);
  }

  moveDay(offset: number): Promise<any> {
    date.setDate(date.getDate() + offset);
    this.setDate(date);
    return this.setupHarvestLog(day).then(() => {
      this.computeGrid();
      console.log("moveDay done.");
    });
  }

  getDate(): Date {
    console.log("GET: " + date);
    return date;
  }

  //--------------------------------------------------------------------------------------

  addHarvest(f: string, p: string, q: number): Promise<any> {
    console.log("NEW HARVEST: " + q);
    let harvest = { day: day, farm: f, plant: p, quantity: q };
    HARVEST_LOG.push(harvest);
    this.addQuantity(f, p, q);
    return this.service.addHarvest(harvest);
  }

  addFarm(code: string): Promise<any> {
    let farm = {code: code};
    console.log("ADD FARM: " + code);
    FARMS.push(farm);
    this.computeGrid();
    return this.service.addFarm(farm);
}

  addPlant(code: string): Promise<any> {
    let plant = {code: code};
    console.log("ADD PLANT: " + code);
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

let date: Date = new Date();
let day: string = "2016-04-20";

let HARVEST_LOG: Harvest[] = [];

let BUNDLES: { [index: string]: { [index: string]: number } } = {};

let FARM_TOTALS: { [index: string]: number } = {};
let PLANT_TOTALS: { [index: string]: number } = {};
let ALL_TOTAL: { quantity: number } = { quantity: 0 };

let FARMS: { code: string }[] = [];
let PLANTS: { code: string }[] = [];

