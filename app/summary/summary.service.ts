import {Injectable} from 'angular2/core';

import { Summary }   from './summary';

@Injectable()
export class SummaryService {
  getSummary() { 
    return summaryPromise;
  }
}

var SUMMARY = new Summary(
  "Available Now!", 
  1120, 3000, 
  15, 40,
  6, 21,
  3, 5,
  "2016-04-10", "10:41 AM"
);

var summaryPromise = Promise.resolve(SUMMARY);
