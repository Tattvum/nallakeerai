import { Component, OnInit, provide, Inject } from 'angular2/core';
import { RouteConfig, Router, ROUTER_DIRECTIVES } from 'angular2/router';

import { WhenComponent } from './when/when.component';
import { BundlesComponent } from './bundles/bundles.component';
import { LoginComponent } from './security/login.component';

import { DataService } from './data/data.service';
import { FirebaseService } from './data/firebase.service';
import { MockbaseService } from './data/mockbase.service';
import { BaseService } from './data/base.service';

import { SecurityService } from './security/security.service';
import { User } from './security/user';
import { NO_LOGIN, FB_URL } from './common';

/**
 * ... declaring this once for all in typings/typings.d.ts (not in git)
 * 
 * Declares the 'commonjs' format module object that identifies the "module id" for the current module.
 * Set a component's `moduleId` metadata property to `module.id` for module-relative urls
 * when the generated module format is 'commonjs'.
 *
 * declare var module: {id: string};
 * 
 * Declares the 'system' format string that identifies the "module id" for the current module.
 * Set a component's `moduleId` metadata property to `__moduleName` for module-relative urls
 * when the generated module format is 'system'.
 * declare var __moduleName: string; 
*/

/**
 * NOTE: DI modes
 * DEVELOPMENT -
 *    BaseService = MockbaseService
 *    NO_LOGIN = true
 *    FB_URL = <any>
 * STAGING -
 *    BaseService = FirebaseService
 *    NO_LOGIN = false
 *    FB_URL = 'https://sizzling-heat-796.firebaseio.com/testroot'
 * PRODUCTION -
 *    BaseService = FirebaseService
 *    NO_LOGIN = false
 *    FB_URL = 'https://nallakeerai-nsp.firebaseio.com'
 */

/**
 * mode: STAGING
 */

@Component({
  moduleId: __moduleName,
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES, WhenComponent],
  //NOTE: https://angular.io/docs/ts/latest/api/core/OpaqueToken-class.html
  providers: [DataService, 
    //provide(FB_URL, {useValue: 'https://nallakeerai-nsp.firebaseio.com'}),
    //provide(FB_URL, {useValue: 'https://sizzling-heat-796.firebaseio.com/testroot'}),
    provide(NO_LOGIN, {useValue: true}),
    //provide(NO_LOGIN, {useValue: false}),
    provide(BaseService, {useClass:    MockbaseService}), 
    //provide(BaseService, {useClass:    FirebaseService}), 
    SecurityService
  ],
})
@RouteConfig([
  { path: '/login', name: 'Login', component: LoginComponent },
  { path: '/all', name: 'Main', component: BundlesComponent },
])
export class AppComponent implements OnInit {
  user: User = null;

  //NOTE: only for dev testing purpose.
  private dummyLogin() {
    this.service.authenticate("test", "test");
  }

  constructor(private router: Router, 
      @Inject(NO_LOGIN) private noLogin: boolean,
      private service: SecurityService) {
    service.authenticated$.subscribe( user => {
      //console.log(user);
      this.user = user 
    });
    //NOTE: only for dev testing purpose.
    if(this.noLogin) this.dummyLogin();
  }

  ngOnInit() {
    //NOTE: only for dev testing purpose.
    if (this.user != null || this.noLogin) this.router.navigate(['Main']);
    else this.router.navigate(['Login']);
  }
}
