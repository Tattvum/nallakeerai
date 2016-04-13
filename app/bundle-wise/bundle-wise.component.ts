import { Component, Input } from 'angular2/core';

import { Thing }   from '../things/thing';
import { ThingsService }   from '../things/things.service';

// Let TypeScript know about the special SystemJS __moduleName variable
declare var __moduleName: string;

@Component({
  moduleId: __moduleName,
  selector: 'bundle-wise',
  templateUrl: 'bundle-wise.component.html',
  styleUrls: ['bundle-wise.component.css'],
  providers:  [ThingsService],
})
export class BundleWiseComponent {
  _total: number = 0;
  _farmTotals: number[];
  _varietyTotals: number[];
  
  @Input() all;

  constructor(private _service: ThingsService) {
    this._service.getAll().then(all => {
      this.all = all;

      this._varietyTotals = new Array(this.all.bundles.length);
      this._varietyTotals.fill(0, 0, this.all.bundles.length);
      this._farmTotals = new Array(this.all.bundles[0].length);
      this._farmTotals.fill(0, 0, this.all.bundles[0].length);

      for (var i = 0; i < this.all.bundles.length; i++) {
        for (var j = 0; j < this.all.bundles[i].length; j++) {
          let cell = this.all.bundles[i][j];
          this._farmTotals[j] += cell;
          this._varietyTotals[i] += cell;
          this._total += cell;
        }  
      }  
    });   
  }

}
