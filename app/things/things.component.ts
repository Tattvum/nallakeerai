import { Component, Input, Output, OnInit, EventEmitter } from 'angular2/core';
import {Router, RouteParams, RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';

import { Thing }   from '../data/thing';
import { Harvest }   from '../data/harvest';
import { DataService }   from '../data/data.service';
import { ThingComponent } from './thing.component';
import { BundlesComponent } from '../bundles/bundles.component';
import { FarmComponent } from '../farm/farm.component';
import { HarvestFormComponent } from '../forms/harvest.form.component';

// Let TypeScript know about the special SystemJS __moduleName variable
declare var __moduleName: string;

@Component({ template: '' }) export class BlankComponent { } // one-line component!

@Component({
  moduleId: __moduleName,
  selector: 'things',
  templateUrl: 'things.component.html',
  styleUrls: ['things.component.css'],
  directives: [ROUTER_DIRECTIVES, ThingComponent],
})
@RouteConfig([
  { path: '/', name: 'Blank', component: BlankComponent, useAsDefault: true },
  { path: '/things/...', name: 'Things', component: ThingsComponent },   //wow! recursive routs!!
  { path: '/all', name: 'All', component: BundlesComponent },
  { path: '/farm/...', name: 'Farm', component: FarmComponent },
  { path: '/harvest', name: 'Harvest', component: HarvestFormComponent },
])
export class ThingsComponent {

  @Input() things: any[];
  private path: string;

  constructor(private service: DataService, private router: Router, routeParams: RouteParams) {
    this.path = routeParams.get('path');
    //console.log(this.path);
    this.service.getThings().then(things => {
      this.things = things;
    });
  }

  click(thing) {
    let newPath = this.path + "/" + thing.name;
    this.service.navigate(newPath);

    this.things.forEach(th => th.isSpecial = false);
    thing.isSpecial = true;

    let params = { path: newPath };
    if (thing.kind == "all") this.router.navigate(['All']);
    else if (thing.kind == "end") this.router.navigate(['./Harvest']);  
    else this.router.navigate(['./Things', params]);
  }

}

