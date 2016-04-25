import { Component, OnInit } from 'angular2/core';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from 'angular2/router';

import { HarvestFormComponent } from './forms/harvest.form.component';
import { ThingsComponent } from './things/things.component';
import { FarmComponent } from './farm/farm.component';
import { WhenComponent } from './when/when.component';
import { BundlesComponent } from './bundles/bundles.component';
import { LoginComponent } from './security/login.component';

import { DataService } from './data/data.service';
import { FirebaseService } from './data/firebase.service';
import { SecurityService } from './security/security.service';
import { User } from './security/user';

// Let TypeScript know about the special SystemJS __moduleName variable
declare var __moduleName: string;

@Component({
  moduleId: __moduleName,
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES, WhenComponent],
  providers: [DataService, FirebaseService, SecurityService],
})
@RouteConfig([
//  { path: '/summary/...', name: 'Report', component: ThingsComponent },
  //  {path: '/farm/...', name: 'Farm', component: FarmComponent },
  { path: '/login', name: 'Login', component: LoginComponent },
  { path: '/all', name: 'Main', component: BundlesComponent },
])
export class AppComponent implements OnInit {
  user: User = null;

  constructor(private router: Router, private service: SecurityService) {
    service.authenticated$.subscribe( user => this.user = user );
  }

  ngOnInit() {
    if (this.user != null) this.router.navigate(['Main']);
    else this.router.navigate(['Login']);
  }
}
