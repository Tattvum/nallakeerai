import {Injectable} from 'angular2/core';

import { Thing }   from './thing';

@Injectable()
export class ThingsService {
  getThings(thingKind: string, thingName:string, all: boolean) {
    let promise;
    if (thingKind == "farms") promise = keeraiBundlePromise;
    else if (thingKind == "varieties") promise = farmBundlePromise;
    else promise = thingBundlePromise;

    if (all) return promise;
    else return promise.then(things => things.filter(thing => thing.isSpecial));
  }
}

var KEERAI_BUNDLES: Thing[] = [
  { name: "Keerai9", isSpecial: true, bundles: 30 },
  { name: "Keerai10", isSpecial: false, bundles: 10 },
  { name: "Keerai1", isSpecial: true, bundles: 10 },
  { name: "Keerai2", isSpecial: false, bundles: 23 },
  { name: "Keerai3", isSpecial: true, bundles: 5 },
  { name: "Keerai7", isSpecial: true, bundles: 70 },
  { name: "Keerai4", isSpecial: false, bundles: 23 },
  { name: "Keerai5", isSpecial: false, bundles: 21 },
  { name: "Keerai6", isSpecial: true, bundles: 15 },
  { name: "Keerai8", isSpecial: false, bundles: 37 },
  { name: "Keerai11", isSpecial: true, bundles: 70 },
  { name: "Keerai13", isSpecial: false, bundles: 23 },
  { name: "Keerai12", isSpecial: false, bundles: 21 },
];

var keeraiBundlePromise = Promise.resolve(KEERAI_BUNDLES);

var FARM_BUNDLES: Thing[] = [
  { name: "Farm1", isSpecial: true, bundles: 10 },
  { name: "Farm2", isSpecial: false, bundles: 23 },
  { name: "Farm3", isSpecial: true, bundles: 5 },
  { name: "Farm4", isSpecial: false, bundles: 23 },
  { name: "Farm5", isSpecial: false, bundles: 21 },
  { name: "Farm6", isSpecial: true, bundles: 15 },
  { name: "Farm7", isSpecial: true, bundles: 70 },
  { name: "Farm8", isSpecial: false, bundles: 37 },
  { name: "Farm9", isSpecial: true, bundles: 30 },
  { name: "Farm10", isSpecial: false, bundles: 10 },
];

var farmBundlePromise = Promise.resolve(FARM_BUNDLES);

var THING_BUNDLES: Thing[] = [
  { name: "Thing6", isSpecial: true, bundles: 15 },
  { name: "Thing8", isSpecial: false, bundles: 31 },
  { name: "Thing11", isSpecial: true, bundles: 70 },
  { name: "Thing12", isSpecial: false, bundles: 41 },
  { name: "Thing9", isSpecial: true, bundles: 30 },
  { name: "Thing13", isSpecial: false, bundles: 23 },
];

var thingBundlePromise = Promise.resolve(THING_BUNDLES);

