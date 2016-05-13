import { Component, Inject } from '@angular/core';
import { NgForm }    from '@angular/common';
import { Router } from '@angular/router-deprecated';

import { SecurityService }   from './security.service';

@Component({
  moduleId: module.id,
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
