import {Injectable} from 'angular2/core';

import { Thing }   from './thing';

@Injectable()
export class ThingsService {
  getThings(kind: string, all:boolean) { 
    let promise;
    if (kind == "farms")  promise = farmsPromise;
    else if (kind == "varieties")  promise = varietiesPromise;
    else promise = thingsPromise;

    if(all) return promise;
    else return promise.then(things => things.filter(thing => thing.isSpecial));
  }
}

var FARMS = [
  {name: "Farm1", isSpecial: false},	
  {name: "Farm2", isSpecial: false},	
  {name: "Farm3", isSpecial: true},	
  {name: "Farm4", isSpecial: false},	
  {name: "Farm5", isSpecial: true},	
  {name: "Farm6", isSpecial: true},	
  {name: "Farm7", isSpecial: false},	
  {name: "Farm8", isSpecial: false},	
  {name: "Farm9", isSpecial: true},	
];

var farmsPromise = Promise.resolve(FARMS);

var VARIETIES = [
  {name: "Keerai1", isSpecial: false},	
  {name: "Keerai2", isSpecial: false},	
  {name: "Keerai3", isSpecial: true},	
  {name: "Keerai4", isSpecial: false},	
  {name: "Keerai5", isSpecial: true},	
  {name: "Keerai1", isSpecial: false},	
  {name: "Keerai2", isSpecial: false},	
  {name: "Keerai3", isSpecial: true},	
  {name: "Keerai4", isSpecial: false},	
  {name: "Keerai5", isSpecial: true},	
];

var varietiesPromise = Promise.resolve(VARIETIES);

var THINGS = [
  {name: "Thing1", isSpecial: false},	
  {name: "Thing2", isSpecial: false},	
  {name: "Thing33", isSpecial: true},	
];

var thingsPromise = Promise.resolve(THINGS);
