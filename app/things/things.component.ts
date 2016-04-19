import { Component, Input, Output, OnInit, EventEmitter } from 'angular2/core';
import {Router, RouteParams, RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';

import { Thing }   from './thing';
import { Harvest }   from './harvest';
import { ThingsService }   from './things.service';
import { ThingComponent } from './thing.component';
import { BundleWiseComponent } from '../bundle-wise/bundle-wise.component';
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
  { path: '/all', name: 'All', component: BundleWiseComponent },
  { path: '/farm/...', name: 'Farm', component: FarmComponent },
  { path: '/harvest', name: 'Harvest', component: HarvestFormComponent },
])
export class ThingsComponent implements OnInit {

  @Input() things: any[];
  private path: string;

  constructor(private service: ThingsService, private router: Router, routeParams: RouteParams) {
    this.path = routeParams.get('path');
    console.log(this.path);
  }

  ngOnInit() {
    this.service.getThings(this.path).then(things => {
      this.things = things;
    });
  }

  click(thing) {
    this.things.forEach(th => th.isSpecial = false);
    thing.isSpecial = true;
    let params = { path: this.path + "/" + thing.name };
    if (thing.kind == "all") this.router.navigate(['All']);
//    else if (thing.kind == "farm") this.router.navigate(['./Farm', params]);
    else if (thing.kind == "end") {
      console.log(this.service.getHarvest(thing.farm, thing.plant));
      this.router.navigate(['./Harvest', {path: this.path + "/" + thing.name}]);  
    } else this.router.navigate(['./Things', params]);
  }

}

