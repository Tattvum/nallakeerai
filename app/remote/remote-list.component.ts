
import {Component, OnInit}   from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {RemoteService}   from './remote.service';

@Component({
  template: `
    <h2>REMOTES</h2>
    <ul class="items">
      <li *ngFor="#remote of remotes" >
        <span class="badge">{{remote.windBearing}}</span> {{remote.summary}} 
      </li>
    </ul>
  `,
})
export class RemoteListComponent implements OnInit {
  constructor(private _service: RemoteService, private _router: Router, routeParams: RouteParams) {}

  remotes;

  ngOnInit() {
    this._service.getRemotes().then(anys => this.remotes = anys)
  }
}
