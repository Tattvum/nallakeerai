import { Component } from 'angular2/core';
import { RouteConfig, Router, RouterOutlet } from 'angular2/router';

import { SummaryComponent } from './summary/summary.component';
import { BundleWiseComponent } from './bundle-wise/bundle-wise.component';
import { ThingsComponent } from './things/things.component';
import { ThingBundleComponent } from './thing-bundle/thing-bundle.component';

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
  directives: [RouterOutlet, SummaryComponent],
})
@RouteConfig([
  {path: '/', name: 'Blank', component: BlankComponent, useAsDefault: true},
  {path: '/bundle-wise', name: 'BundleWise', component: BundleWiseComponent},
  {path: '/things/...', name: 'Things', component: ThingsComponent},
])
export class AppComponent {
  constructor(private _router:Router){}

  onSelected(event) {
    if (event.kind == "bundles") this._router.navigate(['BundleWise'])
    else this._router.navigate(['Things', event]);
  }
}
