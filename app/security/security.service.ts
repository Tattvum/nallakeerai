import {Injectable} from '@angular/core';
import {Subject}    from 'rxjs/Subject';

import { FirebaseService }     from '../data/firebase.service';
import { MockbaseService }     from '../data/mockbase.service';
import { User }     from './user';

@Injectable()
export class SecurityService {

  //IMPORTANT TBD 3C/4 - uncomment and use this in production deployment
  constructor(private service: FirebaseService) {}
  //constructor(private service: MockbaseService) {}

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
