import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';

import { Harvest }     from './harvest';
import { BaseService }     from './base.service';
import { FB_URL }     from '../common';

function log(msg: any, obj: any = "") {
  console.log(msg, obj);
}

@Injectable()
export class FirebaseService extends BaseService {

  private _url = null;
  private fbRoot: any = null;

  constructor(private http: Http, 
        @Inject(FB_URL) private fbURL: string) {
          
    super();
    //WOW: injected url, so it can change during dev testing and production
    this._url = fbURL;
    //WHY: oh this calls server even when the object is just created
    this.fbRoot = new Firebase(this._url);
  }

  protected auth: any = null;

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
  }

  protected authenticateInternal(email: string, password: string): Promise<any> {
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
