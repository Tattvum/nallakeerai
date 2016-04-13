import { Component, Input, Output, OnInit, EventEmitter } from 'angular2/core';
import { NgForm }    from 'angular2/common';
import {Router, RouteParams, RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';

import { Thing }   from './thing';
import { ThingsService }   from './things.service';
import { ThingComponent } from './thing.component';

// Let TypeScript know about the special SystemJS __moduleName variable
declare var __moduleName: string;

@Component({ template: '' }) export class BlankComponent { }

@Component({
  moduleId: __moduleName,
  selector: 'things',
  templateUrl: 'things.component.html',
  styleUrls: ['things.component.css'],
  directives: [ROUTER_DIRECTIVES, ThingComponent],
  providers: [ThingsService],
})
@RouteConfig([
  { path: '/', name: 'Blank', component: BlankComponent, useAsDefault: true },
  { path: '/things/...', name: 'Things', component: ThingsComponent },   //wow! recursive routs!!
])
export class ThingsComponent implements OnInit {

  @Input() things: Thing[];
  private _path: string;

  constructor(private _service: ThingsService, private _router: Router, routeParams: RouteParams) {
    this._path = routeParams.get('path');
  }

  click(thing: Thing) {
    this.things.forEach(th => th.isSpecial = false);
    thing.isSpecial = true;
    this._router.navigate(['./Things', { path: this._path + "/" + thing.name }]);
  }

  ngOnInit() {
    this._service.getThings(this._path).then(things => {
      this.things = things;
    });
  }

}

