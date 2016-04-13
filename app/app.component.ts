import { Component } from 'angular2/core';
import { RouteConfig, Router, RouterOutlet } from 'angular2/router';

import { ThingsComponent } from './things/things.component';

// Let TypeScript know about the special SystemJS __moduleName variable
declare var __moduleName: string;

@Component({
  moduleId: __moduleName,
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [RouterOutlet],
})
@RouteConfig([
  {path: '/things/...', name: 'Things', component: ThingsComponent, useAsDefault: true},
])
export class AppComponent {
}
