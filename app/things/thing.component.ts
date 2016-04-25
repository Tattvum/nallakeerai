import { Component, Input, Output, OnInit, EventEmitter } from 'angular2/core';

import { Thing }   from '../data/thing';

// Let TypeScript know about the special SystemJS __moduleName variable
declare var __moduleName: string;

@Component({
  moduleId: __moduleName,
  selector: "thing",
  templateUrl: 'thing.component.html',
  styleUrls: ['thing.component.css'],
})
export class ThingComponent {

  @Input() data: Thing;
  @Output() selected = new EventEmitter();
  
  click() {
    this.selected.emit(this.data);    
  }

}

