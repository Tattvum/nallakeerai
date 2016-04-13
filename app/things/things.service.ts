import {Injectable} from 'angular2/core';

import { Thing }   from './thing';

@Injectable()
export class ThingsService {
  getThings(path: string) {
    console.log(path);
    
    if (path == null) {
      return Promise.resolve(SUMMARY);
    }
    
    let part = path.split("/");
    let promise = thingBundlePromise;

    let things: Thing[] = [];
    console.log(part);

    if (part.length == 2) {
      if (part[1] == "Farms") {
        for (var i = 0; i < SERVER_MOCK.farms.length; i++) {
          let sum = 0;
          for (var j = 0; j < SERVER_MOCK.keerais.length; j++) {
            sum += SERVER_MOCK.bundles[i][j];
          }
          things.push({ name: "Farm:"+SERVER_MOCK.farms[i], isSpecial:false, bundles: sum });
        }
        promise = Promise.resolve(things);
      } else if (part[1] == "Varieties") {
        for (var i = 0; i < SERVER_MOCK.keerais.length; i++) {
          let sum = 0;
          for (var j = 0; j < SERVER_MOCK.farms.length; j++) {
            sum += SERVER_MOCK.bundles[j][i];
          }
          things.push({ name: "Keerai:"+SERVER_MOCK.keerais[i], isSpecial:false, bundles: sum });
        }
        promise = Promise.resolve(things);
      }
    } else if (part.length == 3) {
      let p = part[2].split(":"); 
      let n = +p[1];
      if (p[0] == "Farm") {
        let sum = 0;
        for (var i = 0; i < SERVER_MOCK.keerais.length; i++) {
          things.push({ name: "Keerai:"+SERVER_MOCK.keerais[i], isSpecial:false, 
              bundles: SERVER_MOCK.bundles[n-1][i] });
        }
        promise = Promise.resolve(things);
      } else if (p[0] == "Keerai") {
        let sum = 0;
        for (var i = 0; i < SERVER_MOCK.farms.length; i++) {
          things.push({ name: "Farm:"+SERVER_MOCK.keerais[i], isSpecial:false, 
              bundles: SERVER_MOCK.bundles[i][n-1] });
        }
        promise = Promise.resolve(things);
      }
    }

    return promise;
  }
}

let SUMMARY : Thing[] = [
  {name: "Bundles", bundles: 1120},
  {name: "Varieties", bundles: 21},
  {name: "Farms", bundles: 21},
];

let SERVER_MOCK = {
  farms: [1, 2, 3, 4, 5, 6, 7],
  keerais: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  bundles: [
    [4, 8, 2, 1, 14, 5, 7, 12, 11, 4, 10, 6, 9, 0, 13], //farm wise
    [9, 1, 3, 2, 14, 7, 4, 8, 7, 12, 13, 11, 13, 10, 5],
    [14, 10, 4, 2, 1, 8, 7, 11, 1, 5, 14, 3, 3, 9, 12],
    [4, 6, 11, 15, 5, 13, 15, 12, 8, 13, 10, 7, 6, 2, 9],
    [15, 5, 8, 15, 11, 6, 12, 3, 6, 15, 11, 9, 4, 2, 3, 1],
    [2, 5, 14, 15, 6, 3, 9, 8, 11, 1, 10, 15, 13, 6, 12],
    [8, 1, 2, 5, 11, 4, 9, 3, 7, 10, 13, 4, 12, 7, 14],
  ],
};

let THING_BUNDLES: Thing[] = [
  { name: "Thing6", isSpecial: true, bundles: 15 },
  { name: "Thing8", isSpecial: false, bundles: 31 },
  { name: "Thing11", isSpecial: true, bundles: 70 },
  { name: "Thing12", isSpecial: false, bundles: 41 },
  { name: "Thing9", isSpecial: true, bundles: 30 },
  { name: "Thing13", isSpecial: false, bundles: 23 },
];

var thingBundlePromise = Promise.resolve(THING_BUNDLES);

