import { Component, Input, Output, OnInit } from 'angular2/core';
import { NgForm }    from 'angular2/common';
import {Router, RouteParams} from 'angular2/router';

import { BundleWise }   from './bundle-wise';
import { BundleWiseService }   from './bundle-wise.service';

// Let TypeScript know about the special SystemJS __moduleName variable
declare var __moduleName: string;

@Component({
  moduleId: __moduleName,
  selector: 'bundle-wise',
  templateUrl: 'bundle-wise.component.html',
  styleUrls: ['bundle-wise.component.css'],
})
export class BundleWiseComponent implements OnInit {
  _total: number = 0;
  _farmTotals: number[];
  _varietyTotals: number[];
  
  @Input()
  bundleWise: BundleWise;
  
  constructor(private _service: BundleWiseService, private _router: Router, routeParams: RouteParams) {
    this._service.getBundles().then(bundleWise => {
      this.bundleWise = bundleWise;

      this._varietyTotals = new Array(this.bundleWise.bundles.length);
      this._varietyTotals.fill(0, 0, this.bundleWise.bundles.length);
      this._farmTotals = new Array(this.bundleWise.bundles[0].length);
      this._farmTotals.fill(0, 0, this.bundleWise.bundles[0].length);

      for (var i = 0; i < this.bundleWise.bundles.length; i++) {
        for (var j = 0; j < this.bundleWise.bundles[i].length; j++) {
          let cell = this.bundleWise.bundles[i][j];
          this._farmTotals[j] += cell;
          this._varietyTotals[i] += cell;
          this._total += cell;
        }  
      }  
    });   
  }
  
  ngOnInit() {
  }

}
