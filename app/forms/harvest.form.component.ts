import { Component, Input } from 'angular2/core';
import { NgForm }    from 'angular2/common';
import { ThingsService }    from '../things/things.service';

// Let TypeScript know about the special SystemJS __moduleName variable
declare var __moduleName: string;

@Component({
  moduleId: __moduleName,
  selector: 'harvest-form',
  templateUrl: 'harvest.form.component.html',
  styleUrls: ['harvest.form.component.css'],
})
export class HarvestFormComponent {
  submitted = true;
  @Input() quantity: number = 0;

  constructor(private service: ThingsService) {}

  onSubmit() {
    this.submitted = true;
    this.service.harvest(this.quantity);
  }

}
