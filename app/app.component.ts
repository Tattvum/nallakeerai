import { Component, OnInit, provide } from '@angular/core';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { WhenComponent } from './when/when.component';
import { BundlesComponent } from './bundles/bundles.component';
import { LoginComponent } from './security/login.component';

import { DataService } from './data/data.service';
import { FirebaseService } from './data/firebase.service';
import { MockbaseService } from './data/mockbase.service';
import { BaseService } from './data/base.service';

import { SecurityService } from './security/security.service';
import { User } from './security/user';

/**
 * ... declaring this once for all in typings/typings.d.ts (not in git)
 * 
 * Declares the 'commonjs' format module object that identifies the "module id" for the current module.
 * Set a component's `moduleId` metadata property to `module.id` for module-relative urls
 * when the generated module format is 'commonjs'.
 * 
  declare var module: {id: string};
 */

@Component({
  moduleId: module.id,
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES, WhenComponent],
  providers: [DataService, 
      provide(BaseService, {useClass:    MockbaseService}), 
      MockbaseService, SecurityService],
})
@RouteConfig([
  { path: '/login', name: 'Login', component: LoginComponent },
  { path: '/all', name: 'Main', component: BundlesComponent },
])
export class AppComponent implements OnInit {
  //IMPORTANT TBD 3A/4 - uncomment and use this in production deployment
  user: User = null;
  //user: User = {uid: "", email: "testing...", token:"hghgh"};

  constructor(private router: Router, private service: SecurityService) {
    service.authenticated$.subscribe( user => this.user = user );
  }

  ngOnInit() {
    if (this.user != null) this.router.navigate(['Main']);
    else this.router.navigate(['Login']);
  }
}
