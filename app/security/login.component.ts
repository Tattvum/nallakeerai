import { Component } from 'angular2/core';
import { NgForm }    from 'angular2/common';
import { Router } from 'angular2/router';

import { SecurityService }   from './security.service';

// Let TypeScript know about the special SystemJS __moduleName variable
declare var __moduleName: string;

@Component({
  moduleId: __moduleName,
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})
export class LoginComponent {
  
  email: string = "svramu@gmail.com";
  password: string = "";

  constructor(private service: SecurityService, private router: Router) {}
  
  onSignIn() {
    this.service.authenticate(this.email, this.password).then((auth) => {
      this.router.navigate(["../Report"]);
    }).catch((error) => {
      console.log(error);
    });
  }

}
