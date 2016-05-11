import { Component, OnInit } from '@angular/core';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { WhenComponent } from './when/when.component';
import { BundlesComponent } from './bundles/bundles.component';
import { LoginComponent } from './security/login.component';

import { DataService } from './data/data.service';
import { FirebaseService } from './data/firebase.service';
import { MockbaseService } from './data/mockbase.service';
import { SecurityService } from './security/security.service';
import { User } from './security/user';

//Let TypeScript know about the special CommonJS module.id variable
declare var module: {id: string};

@Component({
  moduleId: module.id,
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES, WhenComponent],
  providers: [DataService, FirebaseService,, MockbaseService, SecurityService],
})
@RouteConfig([
  { path: '/login', name: 'Login', component: LoginComponent },
  { path: '/all', name: 'Main', component: BundlesComponent },
])
export class AppComponent implements OnInit {
  //IMPORTANT TBD 3A/4 - uncomment and use this in production deployment
  user: User = null;
  //user: User = {uid: "", email: "testing...", token:""};

  constructor(private router: Router, private service: SecurityService) {
    service.authenticated$.subscribe( user => this.user = user );
  }

  ngOnInit() {
    if (this.user != null) this.router.navigate(['Main']);
    else this.router.navigate(['Login']);
  }
}
