import { Component, Input } from 'angular2/core';
import { Router, RouteParams, RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';

import { ThingsPlainComponent } from '../things/things.plain.component';
import { ThingsComponent } from '../things/things.component';
import { BundleWiseComponent } from '../bundle-wise/bundle-wise.component';

// Let TypeScript know about the special SystemJS __moduleName variable
declare var __moduleName: string;

@Component({ template: '' }) export class BlankComponent { } // one-line component!

@Component({
  moduleId: __moduleName,
  selector: 'farm',
  templateUrl: 'farm.component.html',
  styleUrls: ['farm.component.css'],
  directives: [ROUTER_DIRECTIVES],
})
@RouteConfig([
  { path: '/', name: 'Blank', component: BlankComponent, useAsDefault: true },
  { path: '/plants', name: 'Plants', component: ThingsPlainComponent },
  { path: '/beds', name: 'Beds', component: BundleWiseComponent },
//  { path: '/things/...', name: 'Things', component: ThingsComponent },
])
export class FarmComponent {

  @Input() farm: string;

  private path: string;

  constructor(private router: Router, private routeParams: RouteParams) {
    this.path = routeParams.get('path');
  }

  click(where: string) {
    console.log(where + " " + this.path);
    if (where == "plants") this.router.navigate(['./Plants', { path: this.path }]);
    else if (where == "things") this.router.navigate(['./Things', { path: this.path }]);
    else this.router.navigate(['./Beds']);
  }

}

