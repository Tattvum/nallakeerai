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
  prev: Date;
  now: Date;
  next: Date;

  move(date: Date, offset: number) {
    date.setDate(date.getDate() + offset);
  }

  constructor(private service: ThingsService) {
    this.now = new Date();
    this.prev = new Date(); this.move(this.prev, -1);
    this.next = new Date(); this.move(this.next, +1);   
  }

  moveAll(offset: number) {
    this.move(this.prev, offset);
    this.move(this.now, offset);
    this.move(this.next, offset);
  }

  format(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  clickPrev(event) {
    this.service.setDay(this.format(this.prev));
    this.moveAll(-1);
  }

  clickNow(event) {
    this.service.setDay(this.format(this.now));
  }

  clickNext(event) {
    this.service.setDay(this.format(this.next));
    this.moveAll(+1);
  }

}
