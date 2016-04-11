import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

export class Junk {
  constructor(public id: number, public name: string) { }
}

@Injectable()
export class RemoteService {
  constructor (private http: Http) {}
  
  private _url1 = 'https://publicdata-weather.firebaseio.com/austin/daily/data.json?print=pretty';
  private _url2 = 'https://nallakeerai-nsp.firebaseio.com/testroot.json';
  
  getRemotes () {
    return this.http.get(this._url1).toPromise()
                  .then(res => res.json(), this.handleError);
  }

  post (data: string) {
    return this.http.post(this._url2, data).toPromise()
                  .then(res => res.json(), this.handleError);
  }
 
  private handleError (error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

}
