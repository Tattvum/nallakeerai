import { Component, Input } from 'angular2/core';

import { Thing }   from '../data/thing';
import { DataService }   from '../data/data.service';
import { HarvestFormComponent }   from '../forms/harvest.form.component';

// Let TypeScript know about the special SystemJS __moduleName variable
declare var __moduleName: string;

@Component({
  moduleId: __moduleName,
  selector: 'bundle-wise',
  templateUrl: 'bundle-wise.component.html',
  styleUrls: ['bundle-wise.component.css'],
  directives: [HarvestFormComponent],
})
export class BundleWiseComponent {
  private all;
  private quantity: number = 13;

  constructor(private service: DataService) {
    this.service.getAll().then(all => {
      this.all = all;
    });   
  }

}
