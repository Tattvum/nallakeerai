import { Component, Input } from 'angular2/core';

import { Thing }   from '../things/thing';
import { ThingsService }   from '../things/things.service';

// Let TypeScript know about the special SystemJS __moduleName variable
declare var __moduleName: string;

@Component({
  moduleId: __moduleName,
  selector: 'bundle-wise',
  templateUrl: 'bundle-wise.component.html',
  styleUrls: ['bundle-wise.component.css'],
})
export class BundleWiseComponent {
  private all;

  constructor(private _service: ThingsService) {
    this._service.getAll().then(all => {
      this.all = all;
    });   
  }

}
