import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable}     from 'rxjs/Observable';

import { Harvest }     from './harvest';
import { BaseService }     from './base.service';

function log(msg: any, obj: any = "") {
  console.log(msg, obj);
}

@Injectable()
export class FirebaseService extends BaseService {

  //IMPORTANT TBD 1/4 - uncomment and use this in production deployment
  //private _url = 'https://nallakeerai-nsp.firebaseio.com';
  private _url = 'https://sizzling-heat-796.firebaseio.com/testroot';
  private fbRoot: any = null;

  constructor(private http: Http) {
    super();
    //oh this calls server even when the object is just created
    this.fbRoot = new Firebase(this._url);
  }

  //IMPORTANT TBD 3B/4 - uncomment and use this in production deployment
  private auth: any;
  //private auth = {password: {email: "testing..."}};

  private url(suffix: string): string {
    let url = this._url + "/" + suffix + ".json?auth=" + this.auth.token;
    log(url);
    return url;
  }

  private url2(suffix: string): string {
    let url = this._url + "/" + suffix;
    log(url);
    return url;
  }
  
  getThings(suffix: string): Promise<any> {
    return this.http.get(this.url(suffix)).toPromise().then(res => res.json(), this.handleError);
  }

  getFarms(): Promise<any> { return this.getThings("farms"); }
  getPlants(): Promise<any> { return this.getThings("plants"); }
  getHarvestLog(day: string): Promise<any> { return this.getThings("harvest/" + day); }

  addThing(suffix: string, thing: any): Promise<any> {
    thing.when = { '.sv': 'timestamp' };
    thing.who = this.auth.password.email;
    return this.http.post(this.url(suffix), JSON.stringify(thing)).toPromise()
      .then(res => log(res.json()), this.handleError);
  }

  addFarm(farm: any): Promise<any> { return this.addThing("farms", farm); }
  addPlant(plant: any): Promise<any> { return this.addThing("plants", plant); }
  addHarvest(harvest: any): Promise<any> { return this.addThing("harvest/" + harvest.day, harvest); }

  private firebaseQuery(): Promise<any> {
    return this.http.get(this.url("harvest")).toPromise().then(res => res.json(), this.handleError);
  }

  private checkFirebaseQuery() {
    let fb = new Firebase(this.url2("harvest"));
    var query = fb.orderByKey().startAt("2016-05-05").endAt("2016-05-07");
    query.once("value", snap => {
      log(snap.val());
    });
/*
    this.firebaseQuery().then((obj)=>{
      log(obj);
    });
*/
  }

  authenticate(email: string, password: string): Promise<any> {
    let self = this;
    let fbr = this.fbRoot;
    return new Promise(function (resolve, reject) {
      fbr.authWithPassword({
        email: email,
        password: password
      }, function (error, authData) {
        if (error) {
          log("Login Failed!", error);
          reject(error);
        } else {
          self.auth = authData;
          log(self.auth.password.email);
          self.checkFirebaseQuery();
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
