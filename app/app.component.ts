import { Component } from 'angular2/core';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from 'angular2/router';

import { HarvestFormComponent } from './forms/harvest.form.component';
import { ThingsComponent } from './things/things.component';
import { PersonFormComponent } from './person/person-form.component';

// Let TypeScript know about the special SystemJS __moduleName variable
declare var __moduleName: string;

@Component({
  moduleId: __moduleName,
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES],
})
@RouteConfig([
  {path: '/summary/...', name: 'Things', component: ThingsComponent, useAsDefault: true},
])
export class AppComponent {
}
