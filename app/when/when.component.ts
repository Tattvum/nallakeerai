import { Component, Input, Output } from 'angular2/core';
import { ThingsService }    from '../things/things.service';

// Let TypeScript know about the special SystemJS __moduleName variable
declare var __moduleName: string;

@Component({
  moduleId: __moduleName,
  selector: 'when',
  templateUrl: 'when.component.html',
  styleUrls: ['when.component.css'],
})
export class WhenComponent {

  showDay() {//wow, a nice way to listen to variable changes - use gui
    return this.service.getDayString();
  }

  constructor(private service: ThingsService) {}

  clickPrev(event) {
    this.service.moveDay(-1);
  }

  clickNow(event) {
    //this.day = this.service.getDayString();
  }

  clickNext(event) {
    this.service.moveDay(+1);
  }

}
