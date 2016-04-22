import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

import { Harvest }     from './harvest';

@Injectable()
export class FirebaseService {
  constructor (private http: Http) {}
  
  private _url2 = 'https://nallakeerai-nsp.firebaseio.com/harvest';
  
  addHarvest(harvest: any) {
    harvest.when = {'.sv': 'timestamp'}; 
    let url = this._url2+"/"+harvest.day+".json";
    console.log(url);
    return this.http.post(url, JSON.stringify(harvest)).toPromise()
                  .then(res => console.log(res.json()), this.handleError);
  }
  
/*
  getRemotes () {
    return this.http.get(this._url2).toPromise()
                  .then(res => res.json(), this.handleError);
  }

  post (data: string) {
    return this.http.post(this._url2, data).toPromise()
                  .then(res => res.json(), this.handleError);
  }
*/ 
  private handleError (error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

}
