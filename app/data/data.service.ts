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
    DAYS.forEach((dd, d) => {
      FARMS.forEach((ff, f) => {
        PLANTS.forEach((pp, p) => {
          let quantity = Math.floor((Math.random() * 50) + 0);
          HARVEST_LOG.push({ day: DAYS[d], farm: f, plant: p, quantity: quantity });
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
    console.log((len-HARVEST_LOG.length)+" entries removed for day "+day);
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
    this.setupHarvestLog(day).then(() => {
      this.computeGrid();
      console.log("setup done.");
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
    if (ALL_TOTAL == null) ALL_TOTAL = { name: "Bundles", quantity: 0, kind: "all" };
    FARMS.forEach((ff, f) => {
      if (FARM_TOTALS[f] == null) FARM_TOTALS[f] = { name: ff, quantity: 0 };
    });
    PLANTS.forEach((pp, p) => {
      if (PLANT_TOTALS[p] == null) PLANT_TOTALS[p] = { name: pp, quantity: 0 };
    });
    FARMS.forEach((ff, f) => {
      PLANTS.forEach((pp, p) => {
        if (GRID[f] == null) GRID[f] = [];
        if (GRID[f][p] == null) GRID[f][p] = 0;

        if (FARM_GRID[f] == null) FARM_GRID[f] = [];
        if (FARM_GRID[f][p] == null)
          FARM_GRID[f][p] = { name: PLANTS[p], quantity: 0, kind: "end", plant: p, farm: f };

        if (PLANT_GRID[p] == null) PLANT_GRID[p] = [];
        if (PLANT_GRID[p][f] == null)
          PLANT_GRID[p][f] = { name: FARMS[f], quantity: 0, kind: "end", plant: p, farm: f };
      });
    });
    //console.log("ensureNonNullGrid done...");
  }

  zeroGrid() {
    this.ensureNonNullGrid();

    ALL_TOTAL.quantity = 0;
    FARMS.forEach((ff, f) => {
      FARM_TOTALS[f].quantity = 0;
    });
    PLANTS.forEach((pp, p) => {
      PLANT_TOTALS[p].quantity = 0;
    });
    FARMS.forEach((ff, f) => {
      PLANTS.forEach((pp, p) => {
        GRID[f][p] = 0;
        FARM_GRID[f][p].quantity = 0;
        PLANT_GRID[p][f].quantity = 0;
      });
    });
    //console.log("zeroGrid done...");
  }

  computeGrid() {
    this.zeroGrid();

    HARVEST_LOG.forEach(h => {
      if (h.day !== day) return;
      this.addQuantity(h.farm, h.plant, h.quantity);
    });

    console.log("computation complete...");
  }

  addQuantity(f: number, p: number, q: number) {
    PLANT_TOTALS[p].quantity += q;
    FARM_TOTALS[f].quantity += q;
    ALL_TOTAL.quantity += q;
    GRID[f][p] += q;
    FARM_GRID[f][p].quantity += q;
    PLANT_GRID[p][f].quantity += q;
  }

  //--------------------------------------------------------------------------------------

  private path: string = null;
  private state = { day: null, farm: null, plant: null, quantity: 0 };

  navigate(path: string) {
    this.path = path;
    if (path != null) {
      let part = path.split("/");
      if (part.length <= 2) {
        this.state.plant = null;
        this.state.farm = null;
      } else if (part.length == 3) {
        let p = part[2].split(":");
        let n = +p[1] - 1;
        this.state.plant = null;
        this.state.farm = null;
        if (part[1] == "Farms") this.state.farm = n;
        else if (part[1] == "Plants") this.state.plant = n;
      } else if (part.length == 4) {
        let p = part[3].split(":");
        let n = +p[1] - 1;
        if (part[1] == "Farms") this.state.plant = n;
        else if (part[1] == "Plants") this.state.farm = n;
      }
    }
    console.log("NAV: " + path + " " + this.state.day + " " + this.state.farm + " " + this.state.plant);
  }

  getPath(): string {
    return this.path;
  }

  //--------------------------------------------------------------------------------------

  harvest(q: number) {
    console.log("HARVEST: " + q);
    this.state.day = day;
    this.state.quantity = q;
    HARVEST_LOG.push(this.state);
    this.addQuantity(this.state.farm, this.state.plant, q);
    this.service.addHarvest(this.state);
  }

  getHarvest(farm: number, plant: number) {
    return GRID[farm][plant];
  }

  //--------------------------------------------------------------------------------------

  getAll() {
    return Promise.resolve({
      farms: FARMS,
      plants: PLANTS,
      bundles: GRID,
      farmTotals: FARM_TOTALS,
      plantTotals: PLANT_TOTALS,
      grandTotal: ALL_TOTAL,
    });
  }

  //--------------------------------------------------------------------------------------

  getThings(): Promise<any[]> {
    //console.log("PATH: "+this.path);

    if (this.path == null) {//summary list
      let things: any[] = [];
      things.push(ALL_TOTAL);
      things.push({ name: "Farms", quantity: FARMS.length });
      things.push({ name: "Plants", quantity: PLANTS.length });
      return Promise.resolve(things);
    }

    let part = this.path.split("/");
    let promise = null;

    //console.log(part);

    if (part.length == 2) {
      if (part[1] == "Farms") promise = Promise.resolve(FARM_TOTALS);
      else if (part[1] == "Plants") promise = Promise.resolve(PLANT_TOTALS);
    } else if (part.length == 3) {
      let p = part[2].split(":");
      let n = +p[1];
      if (p[0] == "Farm") promise = Promise.resolve(FARM_GRID[n - 1]);
      else if (p[0] == "Keerai") promise = Promise.resolve(PLANT_GRID[n - 1]);
    }

    if (promise === null) console.log("SPMETHING WRONG! The promise is null, beware!");
    return promise;
  }

}

//--------------------------------------------------------------------------------------

let date: Date = new Date();
let day: string = "2016-04-20";

let HARVEST_LOG: Harvest[] = [];

let GRID: number[][] = [];
let FARM_GRID = [];
let PLANT_GRID = [];
let FARM_TOTALS: Thing[] = [];
let PLANT_TOTALS: Thing[] = [];
let ALL_TOTAL: Thing = { name: "Bundles", quantity: 0, kind: "all" };

let FARMS = ["Farm:1", "Farm:2", "Farm:3", "Farm:4", "Farm:5", "Farm:6", "Farm:7"];
let PLANTS = [
  "Keerai:1", "Keerai:2", "Keerai:3", "Keerai:4", "Keerai:5",
  "Keerai:6", "Keerai:7", "Keerai:8", "Keerai:9", "Keerai:10",
  "Keerai:11", "Keerai:12", "Keerai:13", "Keerai:14", "Keerai:15"];

