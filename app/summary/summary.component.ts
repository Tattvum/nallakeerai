import { Component, Input, Output, OnInit, EventEmitter } from 'angular2/core';
import { NgForm }    from 'angular2/common';
import {Router, RouteParams} from 'angular2/router';

import { Summary }   from './summary';
import { SummaryService }   from './summary.service';

// Let TypeScript know about the special SystemJS __moduleName variable
declare var __moduleName: string;

@Component({
  moduleId: __moduleName,
  selector: 'summary',
  templateUrl: 'summary.component.html',
  styleUrls: ['summary.component.css'],
  providers:  [SummaryService],
})
export class SummaryComponent implements OnInit {
  @Input() summary: Summary;
  @Output() selected = new EventEmitter();
  
  constructor(private _service: SummaryService) {
    this._service.getSummary().then(summary => {
      this.summary = summary;
    });
  }
  
  click(kind: string, all:boolean) {
    this.selected.emit({"kind": kind, "all": all});
  }

  ngOnInit() {
    
  }

}

