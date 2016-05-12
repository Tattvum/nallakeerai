import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';

import { BaseService }     from '../data/base.service';

import { User }     from './user';

@Injectable()
export class SecurityService {

  constructor(private service: BaseService) {}

  private user: User = null;
  
  private authenticated = new Subject<User>();
  authenticated$ = this.authenticated.asObservable();

  authenticate(email: string, password: string): Promise<any> {
    let p = this.service.authenticate(email, password);
    p.then((auth) => {
      this.user = new User(auth.uid, email, auth.token);
      //console.log(this.user);
      this.authenticated.next(this.user);
    });
    return p;
  }


}
