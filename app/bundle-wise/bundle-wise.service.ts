import {Injectable} from 'angular2/core';

import { BundleWise }   from './bundle-wise';

@Injectable()
export class BundleWiseService {
  getBundles() { 
    return bundlewisePromise;
  }
}

var BUNDLE_WISE = new BundleWise(
  ["Farm1", "Farm2", "F3", "F4", "Farm5"],
  ["Keerai1", "Keerai2", "Keerai3", "K4", "K5", "K6"],
  [
    [1, 2, 3, 4, 5, 7],
    [5, 0, 0, 1, 5, 4],
    [1, 9, 4, 4, 5, 0],
    [1, 5, 0, 4, 6, 1],
    [9, 9, 3, 4, 1, 2],
  ]
);

var bundlewisePromise = Promise.resolve(BUNDLE_WISE);
