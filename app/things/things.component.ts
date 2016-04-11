import { Component, Input, Output, OnInit, EventEmitter } from 'angular2/core';
import { NgForm }    from 'angular2/common';
import {Router, RouteParams} from 'angular2/router';

import { Thing }   from './thing';
import { ThingsService }   from './things.service';

// Let TypeScript know about the special SystemJS __moduleName variable
declare var __moduleName: string;

@Component({
  moduleId: __moduleName,
  selector: 'things',
  templateUrl: 'things.component.html',
  styleUrls: ['things.component.css'],
})
export class ThingsComponent implements OnInit {

  @Input() things: Thing[];
  private _kind: string;
  private _all: boolean; 

  constructor(private _service: ThingsService, private _router: Router, routeParams: RouteParams) {
    this._kind = routeParams.get('kind');
    this._all = (String(routeParams.get('all')) == "true");
  }

  @Output() selected = new EventEmitter();
  
  _rows: number[] = new Array();
  _COLS: number[] = [0, 1, 2, 3, 4, 5, 6];
  
  ngOnInit() {
    this._service.getThings(this._kind, this._all).then(things => {
      this.things = things;
      let r = Math.ceil(this.things.length / this._COLS.length);
      for (var i = 0; i < r; i++) {
        this._rows.push(i);    
      }
    });
  }
  
  idx(row:number, col:number): number {
    return row * (this._COLS.length) + col;
  }
  
  click(what: string) {
    this.selected.emit(what);
  }

}

