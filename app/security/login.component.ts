import { Component, Inject } from '@angular/core';
import { NgForm }    from '@angular/common';
import { Router } from '@angular/router-deprecated';

import { SecurityService }   from './security.service';
import { NO_LOGIN }   from '../common';

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
      @Inject(NO_LOGIN) private noLogin: boolean, 
      private router: Router) {
    //HACK: any other way is not synchronizing with other constructors
    if(noLogin) setTimeout(()=>{
      this.email = 'test';
      this.password = 'test';
      this.onSignIn();
    }, 2000);      
  }
  
  onSignIn() {
    this.service.authenticate(this.email, this.password).then((auth) => {
      this.router.navigate(["../Main"]);
    }).catch((error) => {
      alert(error);
    });
  }

}
