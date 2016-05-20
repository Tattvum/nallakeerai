import { Component, Inject } from 'angular2/core';
import { NgForm }    from 'angular2/common';
import { Router } from 'angular2/router';

import { SecurityService }   from './security.service';

@Component({
  moduleId: __moduleName,
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})
export class LoginComponent {
  
  email: string = "";
  password: string = "";

  constructor(private service: SecurityService, 
      private router: Router) {}
  
  onSignIn() {
    this.service.authenticate(this.email, this.password).then((auth) => {
      this.router.navigate(["../Main"]);
    }).catch((error) => {
      alert(error);
    });
  }

}
