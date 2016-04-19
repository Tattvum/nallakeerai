import { Component, Input, Output, OnInit, EventEmitter } from 'angular2/core';
import {Router, RouteParams } from 'angular2/router';

import { Thing }   from './thing';
import { ThingsService }   from './things.service';
import { ThingComponent } from './thing.component';

// Let TypeScript know about the special SystemJS __moduleName variable
declare var __moduleName: string;

@Component({
  moduleId: __moduleName,
  selector: 'things-plain',
  templateUrl: 'things.plain.component.html',
  styleUrls: ['things.component.css'],
  directives: [ThingComponent],
})
export class ThingsPlainComponent implements OnInit {

  @Input() things: Thing[];
  private path: string;
  
  constructor(private service: ThingsService, private router: Router, routeParams: RouteParams) {
    this.path = routeParams.get('path');
    console.log(this.path);
  }

  @Output() selected = new EventEmitter();

  click(thing: Thing) {
    console.log(thing);
    this.selected.emit(thing);    
  }

  ngOnInit() {
    this.service.getThings(this.path).then(things => {
      this.things = things;
    });
  }

}

