import { Component, Input, Output, OnInit } from 'angular2/core';
import { RouteParams} from 'angular2/router';
import { NgForm }    from 'angular2/common';
import { ThingsService }    from '../things/things.service';
import { Harvest }    from '../things/harvest';

// Let TypeScript know about the special SystemJS __moduleName variable
declare var __moduleName: string;

@Component({
  moduleId: __moduleName,
  selector: 'harvest-form',
  templateUrl: 'harvest.form.component.html',
  styleUrls: ['harvest.form.component.css'],
})
export class HarvestFormComponent {
  harvest = {day: "2016-04-18", farm: "Farm:1", plant: "Keerai:2", quantity: 10};
  submitted = true;

  constructor(private service: ThingsService, private routeParams: RouteParams) {
    let parts = routeParams.get('path').split("/");
    let fid = 2; let pid = 3;
    if (parts[1] == 'Plants') { fid = 3; pid = 2; }
    this.harvest.farm = parts[fid];
    this.harvest.plant = parts[pid];
    this.harvest.quantity = 0;
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.harvest);
    this.service.addHarvest({
      day: this.harvest.day, 
      farm: +this.harvest.farm.split(":")[1]-1, 
      plant: +this.harvest.plant.split(":")[1]-1, 
      quantity: this.harvest.quantity,
    });
  }

  newHarvest() {
    // this.harvest = new Harvest(42, '', '', '');
  }
}
