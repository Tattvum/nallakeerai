import { Component } from '@angular/core';
import { NgForm }    from '@angular/common';
import { Router } from '@angular/router-deprecated';

import { SecurityService }   from './security.service';

// Let TypeScript know about the special SystemJS __moduleName variable
//declare var __moduleName: string;

@Component({
//  moduleId: __moduleName,
  selector: 'login',
  templateUrl: 'app/security/login.component.html',
  styleUrls: ['app/security/login.component.css'],
})
export class LoginComponent {
  
  email: string = "";
  password: string = "";

  constructor(private service: SecurityService, private router: Router) {}
  
  onSignIn() {
    this.service.authenticate(this.email, this.password).then((auth) => {
      this.router.navigate(["../Main"]);
    }).catch((error) => {
      alert(error);
    });
  }

}
