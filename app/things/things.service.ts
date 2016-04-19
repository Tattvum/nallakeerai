import {Injectable} from 'angular2/core';

import { Thing }   from './thing';
import { Harvest }   from './harvest';

@Injectable()
export class ThingsService {

//--------------------------------------------------------------------------------------

  constructor() {
    HARVEST_LOG = [];
    let DAYS = ["2016-04-16", "2016-04-17", "2016-04-18"];
    DAYS.forEach((dd, d) => {
      FARMS.forEach((ff, f) => {
        PLANTS.forEach((pp, p) => {
          let quantity = Math.floor((Math.random() * 50) + 0);
          HARVEST_LOG.push({day: DAYS[d], farm: f, plant: p, quantity: quantity});
        })
      })
    });
    
    console.log("generation complete..."); 
    this.computeGrid();
  }

//--------------------------------------------------------------------------------------

  computeGrid() {
    GRID = [];
    FARM_GRID = [];
    PLANT_GRID = [];
    FARM_TOTALS = [];
    PLANT_TOTALS = [];
    ALL_TOTAL.quantity = 0;

    HARVEST_LOG.forEach(h => {      
      if(h.day !== "2016-04-18") return;
      
      if (GRID[h.farm] == null) GRID[h.farm] = [];
      if (GRID[h.farm][h.plant] == null) GRID[h.farm][h.plant] = 0;
      GRID[h.farm][h.plant] += h.quantity;
      ALL_TOTAL.quantity += h.quantity;

      if (FARM_GRID[h.farm] == null) FARM_GRID[h.farm] = [];
      if (FARM_GRID[h.farm][h.plant] == null) 
          FARM_GRID[h.farm][h.plant] = {name: PLANTS[h.plant], quantity: 0, kind: "end", 
              plant: h.plant, farm: h.farm};
      FARM_GRID[h.farm][h.plant].quantity += h.quantity;

      if (PLANT_GRID[h.plant] == null) PLANT_GRID[h.plant] = [];
      if (PLANT_GRID[h.plant][h.farm] == null) 
          PLANT_GRID[h.plant][h.farm] = {name: FARMS[h.farm], quantity: 0, kind: "end", 
              plant: h.plant, farm: h.farm};
      PLANT_GRID[h.plant][h.farm].quantity += h.quantity;

      if (FARM_TOTALS[h.farm] == null) 
          FARM_TOTALS[h.farm] = {name: FARMS[h.farm], quantity: 0};
      FARM_TOTALS[h.farm].quantity += h.quantity;

      if (PLANT_TOTALS[h.plant] == null) 
          PLANT_TOTALS[h.plant] = {name: PLANTS[h.plant], quantity: 0};
      PLANT_TOTALS[h.plant].quantity += h.quantity;
    });
    
    console.log("computation complete..."); 
  }

//--------------------------------------------------------------------------------------

  addHarvest(h: Harvest) {
    console.log(h);
    HARVEST_LOG.push(h);

    PLANT_TOTALS[h.plant].quantity += h.quantity;
    FARM_TOTALS[h.farm].quantity += h.quantity;
    ALL_TOTAL.quantity += h.quantity;
    GRID[h.farm][h.plant] += h.quantity;
    FARM_GRID[h.farm][h.plant].quantity += h.quantity;
    PLANT_GRID[h.plant][h.farm].quantity += h.quantity;
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

  getThings(path: string) {
    console.log(path);
    
    if (path == null) {//summary list
      let things: any[] = [];
      things.push(ALL_TOTAL);  
      things.push({name: "Farms", quantity: FARMS.length});  
      things.push({name: "Plants", quantity: PLANTS.length});  
      return Promise.resolve(things);
    }
    
    let part = path.split("/");
    let promise = null;

    console.log(part);

    if (part.length == 2) {
      if (part[1] == "Farms") promise = Promise.resolve(FARM_TOTALS);
      else if (part[1] == "Plants") promise = Promise.resolve(PLANT_TOTALS);
    } else if (part.length == 3) {
      let p = part[2].split(":"); 
      let n = +p[1];
      if (p[0] == "Farm") promise = Promise.resolve(FARM_GRID[n-1]);
      else if (p[0] == "Keerai") promise = Promise.resolve(PLANT_GRID[n-1]); 
    }

    if(promise === null) console.log("SPMETHING WRONG! The promise is null, beware!");
    return promise;
  }

}

//--------------------------------------------------------------------------------------

let HARVEST_LOG: Harvest[];

let GRID: number[][] = [];
let FARM_GRID = [];
let PLANT_GRID = [];
let FARM_TOTALS: Thing[] = [];
let PLANT_TOTALS: Thing[] = [];
let ALL_TOTAL: Thing = {name: "Bundles", quantity: 0, kind: "all"};
    
let FARMS = ["Farm:1", "Farm:2", "Farm:3", "Farm:4", "Farm:5", "Farm:6", "Farm:7"];
let PLANTS = [
    "Keerai:1", "Keerai:2", "Keerai:3", "Keerai:4", "Keerai:5", 
    "Keerai:6", "Keerai:7", "Keerai:8", "Keerai:9", "Keerai:10", 
    "Keerai:11", "Keerai:12", "Keerai:13", "Keerai:14", "Keerai:15"];

