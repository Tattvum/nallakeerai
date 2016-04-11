import { Component, Input, Output, OnInit, EventEmitter } from 'angular2/core';
import { NgForm }    from 'angular2/common';
import {Router, RouteParams, RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';

import { Thing }   from './thing';
import { ThingsService }   from './things.service';

// Let TypeScript know about the special SystemJS __moduleName variable
declare var __moduleName: string;

@Component({template: ''}) export class BlankComponent {}

@Component({
  moduleId: __moduleName,
  templateUrl: 'things.component.html',
  styleUrls: ['things.component.css'],
  directives: [ROUTER_DIRECTIVES],
  providers:  [ThingsService],
})
@RouteConfig([
  {path: '/', name: 'Blank', component: BlankComponent, useAsDefault: true},
  //wow! recursive routs are possible!!
  {path: '/things/...', name: 'Things', component: ThingsComponent},
])
export class ThingsComponent implements OnInit {

  @Input() things: Thing[];
  private _kind: string;
  private _all: boolean; 

  constructor(private _service: ThingsService, private _router: Router, routeParams: RouteParams) {
    this._kind = routeParams.get('kind');
    this._all = (String(routeParams.get('all')) == "true");
  }

  ngOnInit() {
    this._service.getThings(this._kind, null, this._all).then(things => {
      this.things = things;
    });
  }
  
}

