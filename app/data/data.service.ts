import {Injectable} from 'angular2/core';

import { Thing }   from './thing';
import { Harvest }   from './harvest';

import { FirebaseService }   from './firebase.service';


@Injectable()
export class DataService {

  //--------------------------------------------------------------------------------------

  private setupMockHarvestLog(day: string): Promise<void> {
    if (HARVEST_LOG != null && HARVEST_LOG.length > 0) return Promise.resolve();//Why create dummies again!
    console.log("creating harvest mocks...");
    let DAYS = ["2016-04-19", "2016-04-20", "2016-04-21"];
    DAYS.forEach((d) => {
      FARMS.forEach((f) => {
        PLANTS.forEach((p) => {
          let quantity = Math.floor((Math.random() * 50) + 0);
          HARVEST_LOG.push({ day: d, farm: f.code, plant: p.code, quantity: quantity });
        })
      })
    });
    console.log("generation complete..." + HARVEST_LOG.length);
    return Promise.resolve();
  }

  private deleteHarvestLogEntries(day: string) {
    let i = HARVEST_LOG.length;
    let len = i;
    while (i--) {// looping in reverse to avoid index change after deleting
      if (HARVEST_LOG[i].day == day) HARVEST_LOG.splice(i, 1);
    }
    console.log((len - HARVEST_LOG.length) + " entries removed for day " + day);
  }

  private setupRealHarvestLog(day: string): Promise<void> {
    HARVEST_LOG = [];//DELETE ALL AND FETCH ALL FRESH !! - for now
    return this.service.getFirebaseHarvestLog(day).then(res => {
      if (res != null) {
        let obj = res.json();
        for (var p in obj) {
          if (obj.hasOwnProperty(p)) {
            HARVEST_LOG.push(obj[p]);
          }
        }
      }
      console.log("firebase fetch complete..." + HARVEST_LOG.length);
    });
  }

  private setupHarvestLog(day: string): Promise<void> {
    return this.setupRealHarvestLog(day);
    //return this.setupMockHarvestLog(day);
  }

  constructor(private service: FirebaseService) {
    this.setDate(new Date());
    let self = this;

    FARMS = [];
    PLANTS = [];

    this.service.getFarms().then(res => {
      if (res != null) {
        let obj = res.json();
        for (var key in obj) FARMS.push(obj[key]);
      }
    }).then(() => {
      this.service.getPlants().then(res => {
        if (res != null) {
          let obj = res.json();
          for (var key in obj) PLANTS.push(obj[key]);
        }
      }).then(() => {
        this.setupHarvestLog(day).then(() => {
          this.computeGrid();
          console.log("setup done.");
        });
      });
    });

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

  moveDay(offset: number) {
    date.setDate(date.getDate() + offset);
    this.setDate(date);
    this.setupHarvestLog(day).then(() => {
      this.computeGrid();
      console.log("moveDay done.");
    });
  }

  getDate(): Date {
    console.log("GET: " + date);
    return date;
  }

  //--------------------------------------------------------------------------------------

  ensureNonNullGrid() {
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

  zeroGrid() {
    this.ensureNonNullGrid();

    ALL_TOTAL.quantity = 0;
    FARMS.forEach( (f) => FARM_TOTALS[f.code] = 0 );
    PLANTS.forEach( (p) => PLANT_TOTALS[p.code] = 0 );
    FARMS.forEach( (f) => PLANTS.forEach( (p) => BUNDLES[f.code][p.code] = 0 ));
    //console.log("zeroGrid done...");
  }

  computeGrid() {
    this.zeroGrid();

    HARVEST_LOG.forEach(h => {
      if (h.day !== day) return;
      this.addQuantity(h.farm, h.plant, h.quantity);
    });

    //console.log(BUNDLES);
    console.log("computation complete...");
  }

  addQuantity(f: string, p: string, q: number) {
    PLANT_TOTALS[p] += q;
    FARM_TOTALS[f] += q;
    ALL_TOTAL.quantity += q;
    BUNDLES[f][p] += q;
  }

  //--------------------------------------------------------------------------------------

  harvest(f: string, p: string, q: number) {
    console.log("NEW HARVEST: " + q);
    let harvest = { day: day, farm: f, plant: p, quantity: q };
    HARVEST_LOG.push(harvest);
    this.addQuantity(f, p, q);
    this.service.addHarvest(harvest);
  }

  addFarm(code: string) {
    let farm = {code: code};
    console.log("ADD FARM: " + code);
    FARMS.push(farm);
    this.computeGrid();
    this.service.addFarm(farm);
}

  addPlant(code: string) {
    let plant = {code: code};
    console.log("ADD PLANT: " + code);
    PLANTS.push(plant);
    this.computeGrid();
    this.service.addPlant(plant);
  }

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

