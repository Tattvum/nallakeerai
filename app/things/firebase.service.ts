import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

import { Harvest }     from './harvest';

@Injectable()
export class FirebaseService {
  constructor(private http: Http) { }

  private _url = 'https://nallakeerai-nsp.firebaseio.com/harvest';
  private fbRoot = new Firebase(this._url);

  addHarvest(harvest: any) {
    harvest.when = { '.sv': 'timestamp' };
    let url = this._url + "/" + harvest.day + ".json";
    console.log(url);
    return this.http.post(url, JSON.stringify(harvest)).toPromise()
      .then(res => console.log(res.json()), this.handleError);
  }

  getFirebaseHarvestLog(day: string) {
    let url = this._url + "/" + day + ".json";
/*
    var fb = new Firebase(this._url + "/" + day);
    fb.on("value", function (snapshot) {
      console.log(snapshot.val());
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    this.authenticate("a@b.c", "xxxx")
        .then(auth => {console.log("called: "+auth.uid)})
        .catch(err => {console.log("error: "+err)});
*/
    console.log(url);
    return this.http.get(url).toPromise().then(res => res, this.handleError);
  }

  authenticate(email: string, password: string): Promise<any> {
    let fbr = this.fbRoot;
    return new Promise(function(resolve, reject) {
      fbr.authWithPassword({
        email: email,
        password: password
      }, function (error, authData) {
        if (error) {
          console.log("Login Failed!", error);
          reject(error);
        } else {
          resolve(authData);
        }
      });
    });
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

}
