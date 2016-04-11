import { Component } from 'angular2/core';
import { RouteConfig, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';

import { Summary } from './summary/summary';
import { SummaryComponent } from './summary/summary.component';
import { SummaryService } from './summary/summary.service';

import { BundleWise } from './bundle-wise/bundle-wise';
import { BundleWiseService } from './bundle-wise/bundle-wise.service';
import { BundleWiseComponent } from './bundle-wise/bundle-wise.component';

import { Thing } from './things/thing';
import { ThingsComponent } from './things/things.component';
import { ThingsService } from './things/things.service';

// Let TypeScript know about the special SystemJS __moduleName variable
declare var __moduleName: string;


@Component({
  moduleId: __moduleName,
  template: '',
})
export class BlankComponent {
}

@Component({
  moduleId: __moduleName,
  selector: 'ag-dash',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES, SummaryComponent],
  providers:  [ROUTER_PROVIDERS, SummaryService, ThingsService, BundleWiseService],
})
@RouteConfig([
  {path: '/', name: 'Blank', component: BlankComponent, useAsDefault: true},
  {path: '/bundle-wise', name: 'BundleWise', component: BundleWiseComponent},
  {path: '/things', name: 'Things', component: ThingsComponent},
])
export class AppComponent {
  constructor(private _router:Router){}

  onSelected(event) {
    if (event.kind == "bundles") this._router.navigate(['BundleWise'])
    else this._router.navigate(['Things', event]);
  }
}
