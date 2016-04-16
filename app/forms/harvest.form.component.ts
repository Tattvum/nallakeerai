import { Component, Input, Output, OnInit } from 'angular2/core';
import { RouteParams} from 'angular2/router';
import { NgForm }    from 'angular2/common';
import { Harvest }    from './harvest';

// Let TypeScript know about the special SystemJS __moduleName variable
declare var __moduleName: string;

@Component({
  moduleId: __moduleName,
  selector: 'harvest-form',
  templateUrl: 'harvest.form.component.html',
  styleUrls: ['harvest.form.component.css'],
})
export class HarvestFormComponent {
  harvest: Harvest = new Harvest("123", "2016-04-16", "Farm1", "Keerai2", 10);
  submitted = true;

  constructor(private routeParams: RouteParams) {
    this.harvest.quantity = +routeParams.get('bundles');
    let parts = routeParams.get('path').split("/");
    let fid = 2; let pid = 3;
    if (parts[1] == 'Plants') { fid = 3; pid = 2; }
    this.harvest.farm = parts[fid];
    this.harvest.plant = parts[pid];
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.harvest);
  }

  newHarvest() {
    // this.harvest = new Harvest(42, '', '', '');
  }
}
