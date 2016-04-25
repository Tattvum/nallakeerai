import { Component } from 'angular2/core';
import { NgForm }    from 'angular2/common';

import { ThingsService }   from '../things/things.service';

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
  password: string = "pass";

  constructor(private service: ThingsService) {
  }

}
